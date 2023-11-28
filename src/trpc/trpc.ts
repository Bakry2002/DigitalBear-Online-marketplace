import { ExpressContext } from "@/server";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<ExpressContext>().create();

export const router = t.router; // 👈 `router` is the same as `appRouter` in the backend
export const publicProcedure = t.procedure; // for public api access
