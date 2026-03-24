import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Creates tables for OpenClaw intelligence feed and job queue.
// Visit /api/intel/setup once after first deploy or after adding new tables.

export async function GET() {
  try {
    const sql = getDb();

    // OpenClaw intelligence feed — ingested data from browser relay skills
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
    await sql`CREATE INDEX IF NOT EXISTS openclaw_intel_source_idx ON openclaw_intel (source)`;

    // OpenClaw job queue — dashboard posts jobs, OpenClaw polls and processes
    await sql`
      CREATE TABLE IF NOT EXISTS openclaw_queue (
        id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        type         TEXT        NOT NULL DEFAULT 'gamma_strategy',
        client_name  TEXT,
        brief        TEXT        NOT NULL,
        status       TEXT        NOT NULL DEFAULT 'pending',
        result       TEXT,
        gamma_url    TEXT,
        metadata     JSONB       NOT NULL DEFAULT '{}',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        completed_at TIMESTAMPTZ
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS openclaw_queue_status_idx ON openclaw_queue (status)`;

    return NextResponse.json({
      ok: true,
      message: "openclaw_intel and openclaw_queue tables ready",
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
