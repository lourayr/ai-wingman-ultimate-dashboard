import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT
        id, session_id, status, current_step,
        email, business_name, industry_model, ai_comfort,
        investment_capacity, created_at, updated_at
      FROM onboarding_submissions
      ORDER BY updated_at DESC
    `;
    return NextResponse.json({ ok: true, submissions: rows });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
