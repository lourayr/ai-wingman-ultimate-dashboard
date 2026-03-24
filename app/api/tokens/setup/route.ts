import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
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
    return NextResponse.json({ ok: true, message: "user_tokens table ready" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
