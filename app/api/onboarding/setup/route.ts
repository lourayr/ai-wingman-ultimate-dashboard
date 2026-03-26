import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
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

    // Idempotent migrations — safe to run multiple times
    const migrations = [
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS brand_bio TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS brand_voice TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS banned_words TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS persuasive_premise TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS testimonials TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS content_keywords TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS offer_keywords TEXT`,
      // v2 intake form fields
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS contact_name TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS business_description TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS core_offer TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS daily_drains TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS instagram_url TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS instagram_desc TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS best_content TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS sales_process TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS lead_magnet TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS offer_tiers TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS competitors TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS hidden_fear TEXT`,
      `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS content_constraints TEXT`,
    ];
    const results: { migration: string; status: string }[] = [];
    for (const m of migrations) {
      try {
        // neon() is a tagged-template function; cast single-element array to satisfy TS
        await sql([m] as unknown as TemplateStringsArray);
        results.push({ migration: m.slice(0, 60), status: "ok" });
      } catch (err) {
        results.push({ migration: m.slice(0, 60), status: String(err).slice(0, 100) });
      }
    }

    return NextResponse.json({ ok: true, message: "Table ready — all columns applied", results });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
