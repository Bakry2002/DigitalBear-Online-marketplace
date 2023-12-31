/**
 * the backend trpc server
 * Here we can defined all the api route needed for the backend
 */

import { z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../payload";
import { paymentRouter } from "./payment-router";

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,

  // get infinite products with pagination
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(), // nullish means null or undefined
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { sort, limit, ...queryOptions } = query;

      // grab data from database
      const payload = await getPayloadClient();

      // make the query options compatible with payload to understand
      const parsedQueryOptions: Record<string, { equals: string }> = {};

      Object.entries(queryOptions).forEach(([key, value]) => {
        parsedQueryOptions[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;

      const {
        docs: products,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOptions,
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      return {
        products,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

export type AppRouter = typeof appRouter;
