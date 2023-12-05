import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/get-serverSide-user";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const { user } = await getServerSideUser(cookies);

  if (user && ["/sign-in", "/sign-up"].includes(nextUrl.pathname)) {
    // if user is logged in and they are trying to access sign-in or sign-up page
    // no because they are already logged in
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  return NextResponse.next();
}
