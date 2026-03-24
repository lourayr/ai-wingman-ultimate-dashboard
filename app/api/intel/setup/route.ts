import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Creates the openclaw_intel table.
// Visit /api/intel/setup once after deploying to initialize.

export async function GET() {
  try {
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS openclaw_intel (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        source     TEXT        NOT NULL,
        title      TEXT,
        content    TEXT        NOT NULL,
        metadata   JSONB       NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    // Index for source filtering
    await sql`
      CREATE INDEX IF NOT EXISTS openclaw_intel_source_idx ON openclaw_intel (source)
    `;

    return NextResponse.json({ ok: true, message: "openclaw_intel table ready" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
