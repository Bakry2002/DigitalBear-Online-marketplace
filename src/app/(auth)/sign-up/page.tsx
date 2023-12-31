"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodError, z } from "zod";
import { toast } from "sonner";
import {
  AuthFormValues,
  AuthSchema,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  /***
   * React hook form Library:
   * Form initial values
   * Form submission
   * Form error handling
   **/
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = trpc.auth.createPayloadUser.useMutation({
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        toast.error(
          "This Email is already in use. Please try again with a different email."
        );

        return;
      }

      if (error instanceof ZodError) {
        toast.error(error.issues[0].message);

        return;
      }

      toast.error("Something went wrong. Please try again.");
    },

    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification link sent to ${sentToEmail}.`);
      router.push(`/verify-email?to=${sentToEmail}`);
    },
  });
  // console.log(data)

  const onSubmit = ({ email, password }: AuthFormValues) => {
    // send data to server
    mutate({ email, password });
  };
  return (
    <>
      <div className="container relative flex pt-20 flex-col justify-center items-center lg:px-0">
        <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center text-center">
            <Icons.beerLogo className="w-20 h-20 text-primary-500" />
            <h1 className="text-2xl font-bold">Create an account</h1>

            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "link",
                className: "gap-1 items-end",
              })}
            >
              Already have an account? Sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sign up form */}
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    placeholder="you@example.com"
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                  />

                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")} // handle onChange, onBlur, value
                    id="password"
                    type="password"
                    placeholder="Password"
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                  />

                  {errors?.password && (
                    <p className="text-sm text-red-500">
                      {errors?.password?.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <Button>Sign up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
