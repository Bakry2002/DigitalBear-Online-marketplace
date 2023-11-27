"use client";

import { trpc } from "@/trpc/client";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ token }) => {
  const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({
    token,
  });

  // if we an error
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="w-8 h-8 text-red-600" />
        <h3 className="font-semibold text-xl">There was a problem!</h3>
        <p className="text-sm text-muted-foreground text-center">
          This token is not valid or it might be expired.
          <br /> Please try again.
        </p>
      </div>
    );
  }

  if (data?.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative w-full h-full text-muted-foreground">
          <Image
            src="/beer-email-sent.png"
            alt="message envelope indicate email verified"
            width={1024}
            height={768}
            objectFit="cover"
          />
        </div>
        <h3 className="font-semibold text-2xl">You&apos;re all set!</h3>
        <p className="mt-1 text-muted-foreground text-center">
          Thank you for verifying your email.
        </p>
        <Link
          href="/sign-in"
          className={buttonVariants({
            variant: "secondary",
            className: "mt-4",
          })}
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin text-zinc-300 w-8 h-8" />
        <h3 className="font-semibold text-xl">Verifying...</h3>
        <p className="text-sm text-muted-foreground text-center">
          This won&apos;t take long.
        </p>
      </div>
    );
  }
};

export default VerifyEmail;
