import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload from "payload";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

let cashed = (global as any).payload; // we are going to cash our payload so we don't have to make a request to our server every time we want to get our payload

if (!cashed) {
  // if our payload is not cashed then we are going to make a request to our server to get our payload
  cashed = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}
export const getPayloadClient = async ({ initOptions }: Args = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is Missing!");
  }

  if (cashed.client) {
    return cashed.client; // if our payload is cashed then we are going to return our cashed payload
  }

  // if we don't have a promise then we are going to make a request to our server to get our payload
  if (!cashed.promise) {
    cashed.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cashed.client = await cashed.promise; // we are going to wait for our promise to resolve and then we are going to cash our payload
  } catch (error: unknown) {
    cashed.promise = null; // if we get an error then we are going to set our promise to null so we can try again
    throw error;
  }

  return cashed.client;
};
