// we are going to self host our server with express. why not just use the nextjs server? well, we want to be able to use websockets and nextjs doesn't support that. so we are going to use express to host our server and then use nextjs to host our cli
// will create an admin dash board to manage our content
// We are going to use Payload CMS to manage our content. We are going to use the Payload CMS API to get our content and then we are going to use Next.js to render our content

import express from "express";
import { getPayloadClient } from "./payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from "next/dist/build";
import path from "path";
import { PayloadRequest } from "payload/types";
import { parse } from "url";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & {
  rowBody: Buffer;
};

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rowBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`); // we are going to log our admin url
      },
    },
  });

  // cart is a protected route
  const cartRouter = express.Router();
  cartRouter.use(payload.authenticate);
  cartRouter.get("/", async (req, res) => {
    const request = req as PayloadRequest;

    if (!request.user) {
      return res.redirect("/sign-in?origin=cart");
    }

    const parseUrl = parse(req.url, true); // parse the url meaning we can get the query params

    return nextApp.render(req, res, "/cart", parseUrl.query); // we are going to render the cart page
  });

  app.use("/cart", cartRouter);

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is building for production!`);

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
  );
  // nextHandler(req, res) to handle our NextJS requests
  app.use((req, res) => nextHandler(req, res));
  // just like that we can make our self completing independent from the Vercel platform

  nextApp.prepare();
  // nextApp.prepare().then(() => {
  //   payload.logger.info(`Next.js Started!`);
  // });

  app.listen(PORT);
};

start();
