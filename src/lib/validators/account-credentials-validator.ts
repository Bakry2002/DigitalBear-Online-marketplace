/***
 * Form validation schema using zod
 * type AuthFormValues = { email: string; password: string; }
 **/

import { z } from "zod";

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters lon." }),
});

export type AuthFormValues = z.infer<typeof AuthSchema>;
