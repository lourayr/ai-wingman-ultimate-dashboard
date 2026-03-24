import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// OpenClaw Browser Relay endpoint.
// OpenClaw skills POST scraped data here from Synthesize.ai, GhostwriterOS, Gamma, etc.
// The Ops page then displays this as "OpenClaw Intelligence Feed".
//
// POST body: { source, title, content, metadata }
// Header:    X-OpenClaw-Key: <OPENCLAW_WEBHOOK_KEY env var>
//
// GET: returns last 20 items, optionally filtered by ?source=synthesize

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  try {
    const sql = getDb();
    const rows = source
      ? await sql`
          SELECT * FROM openclaw_intel
          WHERE source = ${source}
          ORDER BY created_at DESC
          LIMIT 20
        `
      : await sql`
          SELECT * FROM openclaw_intel
          ORDER BY created_at DESC
          LIMIT 20
        `;
    return NextResponse.json({ ok: true, items: rows });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) });
  }
}

export async function POST(request: NextRequest) {
  // Optional shared secret — if OPENCLAW_WEBHOOK_KEY is set, require it
  const expectedKey = process.env.OPENCLAW_WEBHOOK_KEY;
  if (expectedKey) {
    const provided = request.headers.get("x-openclaw-key");
    if (provided !== expectedKey) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const { source, title, content, metadata } = body;

    if (!source || !content) {
      return NextResponse.json(
        { ok: false, error: "Required: source, content" },
        { status: 400 }
      );
    }

    const sql = getDb();
    await sql`
      INSERT INTO openclaw_intel (source, title, content, metadata)
      VALUES (
        ${source},
        ${title ?? source},
        ${String(content).slice(0, 8000)},
        ${JSON.stringify(metadata ?? {})}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
