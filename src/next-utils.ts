// self host our Next.js server with express

import next from "next";

const PORT = Number(process.env.PORT) || 3000;

export const nextApp = next({
  dev: process.env.NODE_ENV !== "production", // if we are in development mode then we are going to set dev to true
  port: PORT,
});

export const nextHandler = nextApp.getRequestHandler(); // we are going to get our request handler from our next app
