import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildGoogleAuthUrl } from "@/lib/google-auth";
import { randomBytes } from "crypto";

export async function GET() {
  const state = randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("google-oauth-state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  const authUrl = buildGoogleAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
