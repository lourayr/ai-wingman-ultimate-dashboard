import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Job queue for OpenClaw automation flows.
//
// Dashboard POSTs a job here when user clicks "Generate Gamma Strategy".
// OpenClaw polls GET /api/openclaw/queue?status=pending to find work.
// OpenClaw PATCH /api/openclaw/queue/[id] to mark complete and post results.
//
// Auth: same OPENCLAW_WEBHOOK_KEY as ingest endpoint.

function checkAuth(request: NextRequest): boolean {
  const expectedKey = process.env.OPENCLAW_WEBHOOK_KEY;
  if (!expectedKey) return true; // no key set = open (for dev)
  return request.headers.get("x-openclaw-key") === expectedKey;
}

// GET — OpenClaw polls this to pick up pending jobs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "pending";

  // Allow both the dashboard (no auth needed for GET) and OpenClaw to poll
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, type, client_name, brief, status, created_at, completed_at
      FROM openclaw_queue
      WHERE status = ${status}
      ORDER BY created_at ASC
      LIMIT 10
    `;
    return NextResponse.json({ ok: true, jobs: rows });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) });
  }
}

// POST — Dashboard creates a new job when user clicks "Generate Gamma Strategy"
export async function POST(request: NextRequest) {
  try {
    const { type, clientName, brief, metadata } = await request.json();

    if (!type || !brief) {
      return NextResponse.json({ ok: false, error: "Required: type, brief" }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO openclaw_queue (type, client_name, brief, status, metadata)
      VALUES (
        ${type},
        ${clientName ?? "Unknown Client"},
        ${String(brief).slice(0, 12000)},
        'pending',
        ${JSON.stringify(metadata ?? {})}
      )
      RETURNING id
    `;

    return NextResponse.json({ ok: true, jobId: rows[0]?.id });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

// PATCH — OpenClaw calls this to mark a job complete and post the Gamma URL
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, result, gammaUrl } = await request.json();

    if (!id) {
      return NextResponse.json({ ok: false, error: "Required: id" }, { status: 400 });
    }

    const sql = getDb();
    await sql`
      UPDATE openclaw_queue
      SET
        status = ${status ?? "complete"},
        result = ${result ?? null},
        gamma_url = ${gammaUrl ?? null},
        completed_at = now()
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
