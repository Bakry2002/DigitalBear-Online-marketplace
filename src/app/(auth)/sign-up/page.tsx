"use client";

import { Icons } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Page = () => {
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
            <form onSubmit={}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
