import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS onboarding_submissions (
        id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id              TEXT        UNIQUE NOT NULL,
        status                  TEXT        NOT NULL DEFAULT 'draft',
        current_step            INTEGER     NOT NULL DEFAULT 0,
        created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
        email                   TEXT,
        business_name           TEXT,
        website                 TEXT,
        industry_model          TEXT,
        team_structure          TEXT,
        revenue_trajectory      TEXT,
        primary_goal            TEXT,
        biggest_challenge       TEXT,
        tech_stack              TEXT,
        strengths_gaps          TEXT,
        investment_capacity     TEXT,
        success_metrics         TEXT,
        existing_assets         TEXT,
        untapped_opportunity    TEXT,
        scaling_bottleneck      TEXT,
        timeline                TEXT,
        ai_comfort              TEXT,
        dream_scenario          TEXT,
        uvp                     TEXT,
        ideal_client            TEXT,
        unconventional_approach TEXT,
        anything_else           TEXT,
        brand_bio               TEXT,
        brand_voice             TEXT,
        banned_words            TEXT,
        persuasive_premise      TEXT,
        testimonials            TEXT,
        content_keywords        TEXT,
        offer_keywords          TEXT
      )
    `;

    // Idempotent DNA column migrations (no-op if columns already exist)
    try { await sql`ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS brand_bio TEXT`; } catch { /* exists */ }
    try { await sql`ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS brand_voice TEXT`; } catch { /* exists */ }
    try { await sql`ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS banned_words TEXT`; } catch { /* exists */ }
    try { await sql`ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS persuasive_premise TEXT`; } catch { /* exists */ }
    try { await sql`ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS testimonials TEXT`; } catch { /* exists */ }
    try { await sql`ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS content_keywords TEXT`; } catch { /* exists */ }
    try { await sql`ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS offer_keywords TEXT`; } catch { /* exists */ }

    return NextResponse.json({ ok: true, message: "Table ready" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
