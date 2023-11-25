/**
 * the backend trpc server
 * Here we can defined all the api route needed for the backend
 */

import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
