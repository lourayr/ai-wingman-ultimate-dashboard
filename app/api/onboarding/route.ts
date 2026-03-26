import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const V2_COLUMNS = [
  "contact_name", "business_description", "core_offer", "daily_drains",
  "instagram_url", "instagram_desc", "best_content", "sales_process",
  "lead_magnet", "offer_tiers", "competitors", "hidden_fear", "content_constraints",
  "brand_bio", "brand_voice", "banned_words", "persuasive_premise",
  "testimonials", "content_keywords", "offer_keywords",
];

async function runMigrations() {
  const sql = getDb();
  for (const col of V2_COLUMNS) {
    try {
      const q = `ALTER TABLE onboarding_submissions ADD COLUMN IF NOT EXISTS ${col} TEXT`;
      // neon() is a tagged-template function; cast single-element array to satisfy TS
      await sql([q] as unknown as TemplateStringsArray);
    } catch { /* already exists */ }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session");

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "Missing session parameter" },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM onboarding_submissions WHERE session_id = ${sessionId} LIMIT 1
    `;
    if (!rows.length) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, submission: rows[0] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    const {
      sessionId,
      status = "draft",
      currentStep = 0,
      // Core fields (v1 + v2)
      email, businessName, website, industryModel, teamStructure, revenueTrajectory,
      primaryGoal, biggestChallenge, techStack, strengthsGaps,
      investmentCapacity, successMetrics, existingAssets, untappedOpportunity,
      scalingBottleneck, timeline, aiComfort, dreamScenario,
      uvp, idealClient, unconventionalApproach, anythingElse,
      brandBio, brandVoice, bannedWords, persuasivePremise,
      testimonials, contentKeywords, offerKeywords,
      // v2 new fields
      contactName, businessDescription, coreOffer, dailyDrains,
      instagramUrl, instagramDesc, bestContent,
      salesProcess, leadMagnet, offerTiers, competitors,
      hiddenFear, contentConstraints,
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const doInsert = async () => sql`
      INSERT INTO onboarding_submissions (
        session_id, status, current_step,
        email, business_name, website, industry_model, team_structure, revenue_trajectory,
        primary_goal, biggest_challenge, tech_stack, strengths_gaps,
        investment_capacity, success_metrics, existing_assets, untapped_opportunity,
        scaling_bottleneck, timeline, ai_comfort, dream_scenario,
        uvp, ideal_client, unconventional_approach, anything_else,
        brand_bio, brand_voice, banned_words, persuasive_premise,
        testimonials, content_keywords, offer_keywords,
        contact_name, business_description, core_offer, daily_drains,
        instagram_url, instagram_desc, best_content, sales_process,
        lead_magnet, offer_tiers, competitors, hidden_fear, content_constraints
      ) VALUES (
        ${sessionId}, ${status}, ${currentStep},
        ${email ?? null}, ${businessName ?? null}, ${website ?? null},
        ${industryModel ?? null}, ${teamStructure ?? null}, ${revenueTrajectory ?? null},
        ${primaryGoal ?? null}, ${biggestChallenge ?? null}, ${techStack ?? null},
        ${strengthsGaps ?? null}, ${investmentCapacity ?? null}, ${successMetrics ?? null},
        ${existingAssets ?? null}, ${untappedOpportunity ?? null},
        ${scalingBottleneck ?? null}, ${timeline ?? null}, ${aiComfort ?? null},
        ${dreamScenario ?? null}, ${uvp ?? null}, ${idealClient ?? null},
        ${unconventionalApproach ?? null}, ${anythingElse ?? null},
        ${brandBio ?? null}, ${brandVoice ?? null}, ${bannedWords ?? null},
        ${persuasivePremise ?? null}, ${testimonials ?? null},
        ${contentKeywords ?? null}, ${offerKeywords ?? null},
        ${contactName ?? null}, ${businessDescription ?? null}, ${coreOffer ?? null},
        ${dailyDrains ?? null}, ${instagramUrl ?? null}, ${instagramDesc ?? null},
        ${bestContent ?? null}, ${salesProcess ?? null}, ${leadMagnet ?? null},
        ${offerTiers ?? null}, ${competitors ?? null}, ${hiddenFear ?? null},
        ${contentConstraints ?? null}
      )
      ON CONFLICT (session_id) DO UPDATE SET
        status = EXCLUDED.status,
        current_step = EXCLUDED.current_step,
        updated_at = now(),
        email = COALESCE(EXCLUDED.email, onboarding_submissions.email),
        business_name = COALESCE(EXCLUDED.business_name, onboarding_submissions.business_name),
        website = COALESCE(EXCLUDED.website, onboarding_submissions.website),
        industry_model = COALESCE(EXCLUDED.industry_model, onboarding_submissions.industry_model),
        team_structure = COALESCE(EXCLUDED.team_structure, onboarding_submissions.team_structure),
        revenue_trajectory = COALESCE(EXCLUDED.revenue_trajectory, onboarding_submissions.revenue_trajectory),
        primary_goal = COALESCE(EXCLUDED.primary_goal, onboarding_submissions.primary_goal),
        biggest_challenge = COALESCE(EXCLUDED.biggest_challenge, onboarding_submissions.biggest_challenge),
        tech_stack = COALESCE(EXCLUDED.tech_stack, onboarding_submissions.tech_stack),
        strengths_gaps = COALESCE(EXCLUDED.strengths_gaps, onboarding_submissions.strengths_gaps),
        investment_capacity = COALESCE(EXCLUDED.investment_capacity, onboarding_submissions.investment_capacity),
        success_metrics = COALESCE(EXCLUDED.success_metrics, onboarding_submissions.success_metrics),
        existing_assets = COALESCE(EXCLUDED.existing_assets, onboarding_submissions.existing_assets),
        untapped_opportunity = COALESCE(EXCLUDED.untapped_opportunity, onboarding_submissions.untapped_opportunity),
        scaling_bottleneck = COALESCE(EXCLUDED.scaling_bottleneck, onboarding_submissions.scaling_bottleneck),
        timeline = COALESCE(EXCLUDED.timeline, onboarding_submissions.timeline),
        ai_comfort = COALESCE(EXCLUDED.ai_comfort, onboarding_submissions.ai_comfort),
        dream_scenario = COALESCE(EXCLUDED.dream_scenario, onboarding_submissions.dream_scenario),
        uvp = COALESCE(EXCLUDED.uvp, onboarding_submissions.uvp),
        ideal_client = COALESCE(EXCLUDED.ideal_client, onboarding_submissions.ideal_client),
        unconventional_approach = COALESCE(EXCLUDED.unconventional_approach, onboarding_submissions.unconventional_approach),
        anything_else = COALESCE(EXCLUDED.anything_else, onboarding_submissions.anything_else),
        brand_bio = COALESCE(EXCLUDED.brand_bio, onboarding_submissions.brand_bio),
        brand_voice = COALESCE(EXCLUDED.brand_voice, onboarding_submissions.brand_voice),
        banned_words = COALESCE(EXCLUDED.banned_words, onboarding_submissions.banned_words),
        persuasive_premise = COALESCE(EXCLUDED.persuasive_premise, onboarding_submissions.persuasive_premise),
        testimonials = COALESCE(EXCLUDED.testimonials, onboarding_submissions.testimonials),
        content_keywords = COALESCE(EXCLUDED.content_keywords, onboarding_submissions.content_keywords),
        offer_keywords = COALESCE(EXCLUDED.offer_keywords, onboarding_submissions.offer_keywords),
        contact_name = COALESCE(EXCLUDED.contact_name, onboarding_submissions.contact_name),
        business_description = COALESCE(EXCLUDED.business_description, onboarding_submissions.business_description),
        core_offer = COALESCE(EXCLUDED.core_offer, onboarding_submissions.core_offer),
        daily_drains = COALESCE(EXCLUDED.daily_drains, onboarding_submissions.daily_drains),
        instagram_url = COALESCE(EXCLUDED.instagram_url, onboarding_submissions.instagram_url),
        instagram_desc = COALESCE(EXCLUDED.instagram_desc, onboarding_submissions.instagram_desc),
        best_content = COALESCE(EXCLUDED.best_content, onboarding_submissions.best_content),
        sales_process = COALESCE(EXCLUDED.sales_process, onboarding_submissions.sales_process),
        lead_magnet = COALESCE(EXCLUDED.lead_magnet, onboarding_submissions.lead_magnet),
        offer_tiers = COALESCE(EXCLUDED.offer_tiers, onboarding_submissions.offer_tiers),
        competitors = COALESCE(EXCLUDED.competitors, onboarding_submissions.competitors),
        hidden_fear = COALESCE(EXCLUDED.hidden_fear, onboarding_submissions.hidden_fear),
        content_constraints = COALESCE(EXCLUDED.content_constraints, onboarding_submissions.content_constraints)
    `;

    try {
      await doInsert();
    } catch (firstErr) {
      const msg = String(firstErr);
      // Auto-migrate if columns are missing, then retry once
      if (msg.includes("column") && msg.includes("does not exist")) {
        await runMigrations();
        await doInsert();
      } else {
        throw firstErr;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
