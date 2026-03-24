import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/google-auth";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google-oauth-state")?.value;

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/ceo?error=oauth_failed", request.url));
  }

  cookieStore.delete("google-oauth-state");

  try {
    const sql = getDb();
    const tokens = await exchangeCodeForTokens(code);

    // Ensure user_tokens table exists
    await sql`
      CREATE TABLE IF NOT EXISTS user_tokens (
        id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       TEXT        NOT NULL DEFAULT 'ray',
        service       TEXT        NOT NULL,
        access_token  TEXT,
        refresh_token TEXT,
        expires_at    TIMESTAMPTZ,
        scope         TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE(user_id, service)
      )
    `;

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    await sql`
      INSERT INTO user_tokens (user_id, service, access_token, refresh_token, expires_at, scope)
      VALUES ('ray', 'google', ${tokens.access_token}, ${tokens.refresh_token ?? null}, ${expiresAt}, ${tokens.scope})
      ON CONFLICT (user_id, service) DO UPDATE SET
        access_token  = EXCLUDED.access_token,
        refresh_token = COALESCE(EXCLUDED.refresh_token, user_tokens.refresh_token),
        expires_at    = EXCLUDED.expires_at,
        scope         = EXCLUDED.scope,
        updated_at    = now()
    `;

    return NextResponse.redirect(new URL("/ceo?connected=google", request.url));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/ceo?error=token_exchange", request.url));
  }
}
