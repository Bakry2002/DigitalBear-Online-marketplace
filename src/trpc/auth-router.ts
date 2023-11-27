import { AuthSchema } from "../lib/validators/account-credentials-validator";
import { router, publicProcedure } from "./trpc";
import { getPayloadClient } from "../payload";
import { TRPCError } from "@trpc/server";
import payload from "payload";

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
});
