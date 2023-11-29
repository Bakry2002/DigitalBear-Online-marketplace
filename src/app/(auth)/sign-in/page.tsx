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
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin"); // where the user came from a specific page route

  // seller scenario
  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  // customer scenario
  const continueAsCustomer = () => {
    router.replace("/sign-in", undefined);
  };

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

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success("Welcome back!");

      router.refresh(); // refresh the page

      // when user sign in, redirect to the page where they came from
      if (origin) {
        router.push(origin);
        router.refresh();
        return;
      }

      if (isSeller) {
        router.push("/sell");
        return;
      }

      router.push("/");
      router.refresh();
    },

    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password.");
        return;
      }
    },
  });

  const onSubmit = ({ email, password }: AuthFormValues) => {
    // send data to server
    signIn({ email, password });
  };
  return (
    <>
      <div className="container relative flex pt-20 flex-col justify-center items-center lg:px-0">
        <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center text-center">
            <Icons.beerLogo className="w-20 h-20 text-primary-500" />
            <h1 className="text-2xl font-bold">
              Sign in to your {isSeller ? "seller" : ""} account
            </h1>

            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "link",
                className: "gap-1 items-end",
              })}
            >
              Don&apos;t have an account? Create one now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sign in form */}
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
                <Button>Sign in</Button>
              </div>
            </form>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <span className="w-full border-t" />
              </div>
              <div
                aria-hidden="true"
                className="relative flex justify-center text-xs uppercase"
              >
                <span className="text-muted-foreground px-2 bg-background">
                  or
                </span>
              </div>
            </div>

            {isSeller ? (
              <Button
                onClick={continueAsCustomer}
                variant="secondary"
                disabled={isLoading}
              >
                Continue as customer
              </Button>
            ) : (
              <Button
                onClick={continueAsSeller}
                variant="secondary"
                disabled={isLoading}
              >
                Continue as seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
