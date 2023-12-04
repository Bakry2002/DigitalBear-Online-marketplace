import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../payload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No products were selected",
        });
      }

      // get the actual products from the ids given above
      const payload = await getPayloadClient();
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const filteredProducts = products.filter(
        (product) => Boolean(product.priceId) // if priceId exists, then it is a paid product
      );

      // create an order for the selected products
      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((product) => product.id),
          user: user.id,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1, // user can only buy one product at a time because its a digital assets store
        });
      });

      line_items.push({
        price: "price_1OJ1VhJLSHVz1oZYwRIISUWZ",
        quantity: 1,
        adjustable_quantity: {
          enabled: false, // if true, user can change the quantity of the product
        },
      });

      //  create a checkout session for these products
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items, // actual product that is user is buying
        });

        return { url: stripeSession.url };
      } catch (error) {
        console.log(error);

        return { url: null, error: error };
      }
    }),
  pollOrderStatus: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      // get orderId from input
      const { orderId } = input;

      // get payload client
      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No order found",
        });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),
});
