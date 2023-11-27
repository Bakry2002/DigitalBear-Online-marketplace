import { AuthSchema } from "../lib/validators/account-credentials-validator";
import { router, publicProcedure } from "./trpc";
import { getPayloadClient } from "../payload";
import { TRPCError } from "@trpc/server";
import payload from "payload";
import { z } from "zod";

export const authRouter = router({
  // create a user inside our CMS
  // publicProcedure means anyone can call this api endpoints and do not need to be logged to do so
  createPayloadUser: publicProcedure
    .input(AuthSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // get all the users with the same email
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      // Check if the suer already exists
      if (users.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      // create the user
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return { success: true, sentToEmail: email };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      // destructuring the token from the input
      const { token } = input;

      // access to the CMS client to verify the email token
      const payload = await getPayloadClient();

      // ready-made method in payload to verify the email token
      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });

      // if the token is not valid, throw an error
      if (!isVerified) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      // else, success
      return { success: true };
    }),
});

// NOTES:
// query => for reading data
// mutation => for writing data
// input => for both reading and writing data
// publicProcedure => anyone can call this api endpoints and do not need to be logged to do so
// procedure => only logged users can call this api endpoints
