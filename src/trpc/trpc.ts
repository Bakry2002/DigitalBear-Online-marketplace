import { User } from "@/payload-types";
import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { PayloadRequest } from "payload/types";

const t = initTRPC.context<ExpressContext>().create();
const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
  // destructuring the request from the context
  const req = ctx.req as PayloadRequest;

  // destructuring the user from the request
  const { user } = req as { user: User | null }; // if null, meaning user is not logged in

  if (!user || !user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  // else, success, return next action
  return next({
    ctx: {
      user,
    }, // we attach the user to the context for the next action to use so we can destructuring it from the context
  });
});
export const router = t.router; // 👈 `router` is the same as `appRouter` in the backend
export const publicProcedure = t.procedure; // for public api access
export const privateProcedure = t.procedure.use(isAuth); // for private api access
