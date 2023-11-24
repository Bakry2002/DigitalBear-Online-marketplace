// we are going to self host our server with express. why not just use the nextjs server? well, we want to be able to use websockets and nextjs doesn't support that. so we are going to use express to host our server and then use nextjs to host our cli
// will create an admin dash board to manage our content
// We are going to use Payload CMS to manage our content. We are going to use the Payload CMS API to get our content and then we are going to use Next.js to render our content

import express from "express";
import { getPayloadClient } from "./payload";
import { nextApp, nextHandler } from "./next-utils";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`); // we are going to log our admin url
      },
    },
  });

  // nextHandler(req, res) to handle our NextJS requests
  app.use((req, res) => nextHandler(req, res));
  // just like that we can make our self completing independent from the Vercel platform

  nextApp.prepare().then(() => {
    payload.logger.info(`Next.js Started!`);
  });

  app.listen(PORT, () => {
    payload.logger.info(
      `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
    );
  });
};

start();