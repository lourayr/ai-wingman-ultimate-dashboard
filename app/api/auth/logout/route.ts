import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("ops-session");
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
