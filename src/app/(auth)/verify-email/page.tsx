import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const page = ({ searchParams }: PageProps) => {
  const token = searchParams.token;
  const toEmail = searchParams.toEmail;
  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full  flex-col justify-center space-y-6 sm:w-[350px]">
        {token && typeof token === "string" ? (
          <div className="grid gap-6">
            <VerifyEmail />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="relative w-full h-full text-muted-foreground">
              <Image
                src="/beer-email-sent.png"
                alt="message envelope indicate email sent"
                width={1024}
                height={768}
                objectFit="cover"
              />
            </div>

            <h3 className="font-semibold text-2xl">Check your Email</h3>
            {toEmail ? (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to{" "}
                <span className="font-semibold">{toEmail}</span>. Please click
                the link in the email to verify your account.
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to your email. Please click
                the link in the email to verify your account.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
