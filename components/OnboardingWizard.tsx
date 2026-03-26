"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, CheckCircle, ChevronDown } from "lucide-react";
import Navigation from "./Navigation";

// ─── Form shape ───────────────────────────────────────────────────────────────
interface FormData {
  // Section 1 — Business Foundation (Q1–Q4)
  email: string;
  businessName: string;
  website: string;
  instagramUrl: string;
  contactName: string;
  businessDescription: string;
  industryModel: string;
  revenueTrajectory: string;
  teamStructure: string;
  primaryGoal: string;
  // Section 2 — Audience & Offer (Q5–Q9)
  biggestChallenge: string;
  idealClient: string;
  coreOffer: string;
  uniqueApproach: string;
  dailyDrains: string;
  // Section 3 — Operations (Q10–Q13)
  techStack: string;
  investmentCapacity: string;
  aiComfort: string;
  successMetrics: string;
  // Section 4 — Vision & Voice (Q14–Q18)
  dreamScenario: string;
  brandVoice: string;
  bannedWords: string;
  persuasivePremise: string;
  testimonials: string;
  // Section 5 — Growth (Q19–Q20)
  untappedOpportunity: string;
  anythingElse: string;
  // Optional deep-dive (O1–O10)
  bestContent: string;
  contentKeywords: string;
  offerKeywords: string;
  instagramDesc: string;
  salesProcess: string;
  leadMagnet: string;
  offerTiers: string;
  competitors: string;
  hiddenFear: string;
  contentConstraints: string;
  scalingBottleneck: string;
}

const EMPTY: FormData = {
  email: "", businessName: "", website: "", instagramUrl: "", contactName: "",
  businessDescription: "", industryModel: "", revenueTrajectory: "", teamStructure: "",
  primaryGoal: "", biggestChallenge: "", idealClient: "", coreOffer: "",
  uniqueApproach: "", dailyDrains: "", techStack: "", investmentCapacity: "",
  aiComfort: "", successMetrics: "", dreamScenario: "", brandVoice: "",
  bannedWords: "", persuasivePremise: "", testimonials: "",
  untappedOpportunity: "", anythingElse: "",
  bestContent: "", contentKeywords: "", offerKeywords: "", instagramDesc: "",
  salesProcess: "", leadMagnet: "", offerTiers: "", competitors: "",
  hiddenFear: "", contentConstraints: "", scalingBottleneck: "",
};

// ─── Step metadata ─────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Business Foundation", num: 1, total: 5 },
  { label: "Your Audience & Offer", num: 2, total: 5 },
  { label: "Operations & Resources", num: 3, total: 5 },
  { label: "Vision & Voice", num: 4, total: 5 },
  { label: "Growth Intelligence", num: 5, total: 5 },
  { label: "Complete — Optional Deep-Dive", num: 6, total: 6 },
  { label: "Deep-Dive Part 2", num: 7, total: 7 },
];

// ─── Reusable field components ─────────────────────────────────────────────────
function Field({
  q, label, name, value, onChange, placeholder, multiline = false, required = false,
}: {
  q?: string; label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; multiline?: boolean; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {q && <span className="text-xs text-slate-600 uppercase tracking-widest">{q}</span>}
      <label className="block text-slate-200 text-sm font-medium leading-snug">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 resize-none"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60"
        />
      )}
    </div>
  );
}

function RadioGroup({
  q, label, name, value, onChange, options,
}: {
  q?: string; label: string; name: string; value: string;
  onChange: (val: string) => void; options: string[];
}) {
  return (
    <div className="space-y-2">
      {q && <span className="text-xs text-slate-600 uppercase tracking-widest">{q}</span>}
      <label className="block text-slate-200 text-sm font-medium leading-snug">{label}</label>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${value === opt ? "border-purple-500 bg-purple-500/20" : "border-slate-600 group-hover:border-slate-400"}`}>
              {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
            </div>
            <span className="text-slate-300 text-sm" onClick={() => onChange(opt)}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SelectField({
  q, label, name, value, onChange, options,
}: {
  q?: string; label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[];
}) {
  return (
    <div className="space-y-1.5">
      {q && <span className="text-xs text-slate-600 uppercase tracking-widest">{q}</span>}
      <label className="block text-slate-200 text-sm font-medium">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500/60 cursor-pointer pr-8"
        >
          <option value="">Select one...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────
export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return crypto.randomUUID();
    const stored = localStorage.getItem("wingman-onboarding-session");
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem("wingman-onboarding-session", id);
    return id;
  });
  const [saving, setSaving] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Restore in-progress form from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wingman-form-draft");
    if (saved) {
      try { setForm(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    localStorage.setItem("wingman-form-draft", JSON.stringify(updated));
  };

  const handleRadio = (name: keyof FormData, val: string) => {
    const updated = { ...form, [name]: val };
    setForm(updated);
    localStorage.setItem("wingman-form-draft", JSON.stringify(updated));
  };

  const save = async (finalStatus?: string) => {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status: finalStatus ?? "draft",
          currentStep: step,
          email: form.email, businessName: form.businessName, website: form.website,
          industryModel: form.industryModel, teamStructure: form.teamStructure,
          revenueTrajectory: form.revenueTrajectory, primaryGoal: form.primaryGoal,
          biggestChallenge: form.biggestChallenge, techStack: form.techStack,
          investmentCapacity: form.investmentCapacity, successMetrics: form.successMetrics,
          untappedOpportunity: form.untappedOpportunity, aiComfort: form.aiComfort,
          dreamScenario: form.dreamScenario, uvp: form.uniqueApproach,
          idealClient: form.idealClient, unconventionalApproach: form.uniqueApproach,
          anythingElse: form.anythingElse,
          brandVoice: form.brandVoice, bannedWords: form.bannedWords,
          persuasivePremise: form.persuasivePremise, testimonials: form.testimonials,
          contentKeywords: form.contentKeywords, offerKeywords: form.offerKeywords,
          brandBio: form.businessDescription,
          scalingBottleneck: form.scalingBottleneck,
          // v2
          contactName: form.contactName, businessDescription: form.businessDescription,
          coreOffer: form.coreOffer, dailyDrains: form.dailyDrains,
          instagramUrl: form.instagramUrl, instagramDesc: form.instagramDesc,
          bestContent: form.bestContent, salesProcess: form.salesProcess,
          leadMagnet: form.leadMagnet, offerTiers: form.offerTiers,
          competitors: form.competitors, hiddenFear: form.hiddenFear,
          contentConstraints: form.contentConstraints,
        }),
      });
    } catch { /* ignore */ }
    setSaving(false);
  };

  const next = async () => {
    await save();
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo(0, 0);
  };

  const finish = async () => {
    await save("complete");
    localStorage.removeItem("wingman-form-draft");
    router.push(`/onboarding/summary?session=${sessionId}`);
  };

  const finishWithOptional = async () => {
    await save("complete");
    localStorage.removeItem("wingman-form-draft");
    router.push(`/onboarding/summary?session=${sessionId}`);
  };

  const totalSteps = showOptional ? 7 : 6;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Wingman Client Intake
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            This takes about 10–15 minutes. Your answers power everything we build together.
          </p>
        </div>

        {/* Progress */}
        {step < 6 && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Section {step} of 5</span>
              <span>{STEPS[step - 1]?.label}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-6 space-y-6">

          {/* ── STEP 1: Business Foundation ─────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <Field
                q="Q1" label="Business name, website, and your name/title"
                name="businessName" value={form.businessName} onChange={handleChange}
                placeholder="e.g. Golden Age Treasures | goldenage.shop"
                required
              />
              <Field
                label="Your name and title"
                name="contactName" value={form.contactName} onChange={handleChange}
                placeholder="e.g. Ray Robinson, Founder"
              />
              <Field
                label="Website URL"
                name="website" value={form.website} onChange={handleChange}
                placeholder="https://yoursite.com"
              />
              <Field
                label="Email address"
                name="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com"
                required
              />
              <Field
                label="Instagram URL (optional)"
                name="instagramUrl" value={form.instagramUrl} onChange={handleChange}
                placeholder="https://instagram.com/youraccount"
              />
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <Field
                  q="Q2" label="What does your business do, who do you serve, and what outcome do you deliver?"
                  name="businessDescription" value={form.businessDescription} onChange={handleChange}
                  placeholder="e.g. I run an e-commerce store selling curated wellness products to women 45+. Customers leave with products that feel meaningful, not just functional."
                  multiline
                />
              </div>
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <SelectField
                  q="Q3" label="Business model and current revenue range"
                  name="industryModel" value={form.industryModel}
                  onChange={handleChange}
                  options={["E-commerce", "B2B Consulting", "Coaching / Courses", "SaaS / Software", "Agency", "Creator / Influencer", "Retail", "Service Business", "Nonprofit", "Other"]}
                />
                <SelectField
                  label="Annual revenue"
                  name="revenueTrajectory" value={form.revenueTrajectory}
                  onChange={handleChange}
                  options={["Pre-revenue / just starting", "Under $50K/year", "$50K–$100K/year", "$100K–$250K/year", "$250K–$500K/year", "$500K+/year"]}
                />
                <RadioGroup
                  label="Team size"
                  name="teamStructure" value={form.teamStructure}
                  onChange={(v) => handleRadio("teamStructure", v)}
                  options={["Just me", "Me + 1–2 contractors", "Small team (3–5)", "6+"]}
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Audience & Offer ────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <RadioGroup
                q="Q4" label="What is your primary goal for the next 90 days?"
                name="primaryGoal" value={form.primaryGoal}
                onChange={(v) => handleRadio("primaryGoal", v)}
                options={["Get more leads or clients", "Automate and simplify operations", "Launch a new offer or product", "Build a content or marketing system", "Stabilize and systematize what already works", "Other"]}
              />
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q5" label="What is your single biggest challenge right now?"
                  name="biggestChallenge" value={form.biggestChallenge} onChange={handleChange}
                  placeholder="The thing that, if solved, would change everything. e.g. I spend 3 hours every day on admin tasks that should take 20 minutes."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q6" label="Describe your ideal client as one real, specific person."
                  name="idealClient" value={form.idealClient} onChange={handleChange}
                  placeholder="e.g. Sandra is 52, runs a solo bookkeeping practice, has 14 clients, and is drowning in follow-up emails. She has tried Zapier once but gave up."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q7" label="What is your core offer and what transformation does it deliver?"
                  name="coreOffer" value={form.coreOffer} onChange={handleChange}
                  placeholder="e.g. My 90-Day Automation Sprint. Sandra walks away with a full workflow system and 8 hours per week back."
                  multiline
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Operations ──────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <Field
                q="Q8" label="What makes your approach different from everything else available?"
                name="uniqueApproach" value={form.uniqueApproach} onChange={handleChange}
                placeholder="e.g. Most automation consultants hand you a tutorial and leave. I build the system with you in 14 days, using your actual tools."
                multiline
              />
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q9" label="What are the top 3 daily tasks or workflows that drain the most time or energy?"
                  name="dailyDrains" value={form.dailyDrains} onChange={handleChange}
                  placeholder="e.g. (1) Manually sending follow-up emails. (2) Copying client info into my CRM. (3) Posting the same content to 3 platforms separately."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q10" label="List every tool you currently use in your business."
                  name="techStack" value={form.techStack} onChange={handleChange}
                  placeholder="e.g. Gmail, Google Calendar, Notion, QuickBooks, Canva, Instagram, Calendly, WhatsApp, WooCommerce, Stripe"
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <SelectField
                  q="Q11" label="Monthly budget for AI tools and automation"
                  name="investmentCapacity" value={form.investmentCapacity}
                  onChange={handleChange}
                  options={["Under $100/month", "$100–$300/month", "$300–$600/month", "$600–$1,000/month", "$1,000+/month"]}
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Vision & Voice ───────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <RadioGroup
                q="Q12" label="Comfort level with AI and automation"
                name="aiComfort" value={form.aiComfort}
                onChange={(v) => handleRadio("aiComfort", v)}
                options={["Early adopter — I already use AI tools daily", "Curious but cautious — I want to learn as we go", "Skeptical — show me it works before I commit", "Beginner — I am starting from scratch"]}
              />
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q13" label="What does success look like for you personally in 90 days?"
                  name="successMetrics" value={form.successMetrics} onChange={handleChange}
                  placeholder="Not just business metrics. How do you want to feel? e.g. I want to finish work by 3pm and feel like my systems are running instead of me running them."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q14" label="What is your 3-year dream scenario for this business?"
                  name="dreamScenario" value={form.dreamScenario} onChange={handleChange}
                  placeholder="e.g. Fully automated e-commerce generating $500K/year, spending mornings writing and afternoons with family."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <RadioGroup
                  q="Q15" label="How would you describe your brand voice?"
                  name="brandVoice" value={form.brandVoice}
                  onChange={(v) => handleRadio("brandVoice", v)}
                  options={["Warm and conversational", "Direct and no-nonsense", "Authoritative and expert", "Spiritual and values-driven", "Bold and energetic", "Calm and grounding", "Other — I'll describe it below"]}
                />
                {form.brandVoice === "Other — I'll describe it below" && (
                  <div className="mt-2">
                    <textarea
                      name="brandVoice"
                      value={form.brandVoice === "Other — I'll describe it below" ? "" : form.brandVoice}
                      onChange={handleChange}
                      placeholder="Paste 2–3 sentences that sound exactly like you"
                      rows={2}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 5: Growth Intelligence ─────────────────────────── */}
          {step === 5 && (
            <div className="space-y-5">
              <Field
                q="Q16" label="Words, phrases, or tones that must never appear in your content"
                name="bannedWords" value={form.bannedWords} onChange={handleChange}
                placeholder='e.g. Never use "hustle," "crush it," or anything that sounds like bro-marketing. Avoid clinical or cold language.'
              />
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q17" label="What is the core belief your ideal client needs to accept before they will buy from you?"
                  name="persuasivePremise" value={form.persuasivePremise} onChange={handleChange}
                  placeholder="e.g. My client needs to believe that the chaos is not a lack of effort but a lack of systems — and that the right system can be built in days, not months."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q18" label="Do you have any existing proof, testimonials, or client results?"
                  name="testimonials" value={form.testimonials} onChange={handleChange}
                  placeholder='e.g. "Ray saved me 10 hours in the first week." — Sandra M. Also: reduced tool count from 11 to 4 for a coaching client in 14 days.'
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q19" label="What is the single biggest untapped opportunity in your business right now?"
                  name="untappedOpportunity" value={form.untappedOpportunity} onChange={handleChange}
                  placeholder="e.g. I have 400 past customers who have never received a follow-up email. A re-engagement sequence could generate $20K in 60 days."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="Q20" label="Is there anything else we should know about your business, values, or constraints?"
                  name="anythingElse" value={form.anythingElse} onChange={handleChange}
                  placeholder="e.g. I will not use manipulative scarcity tactics. I have ADHD and need systems simple enough that I will actually use them."
                  multiline
                />
              </div>
            </div>
          )}

          {/* ── STEP 6: Completion + Optional offer ─────────────────── */}
          {step === 6 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your strategy brief is ready.</h2>
                <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                  Your 20 answers power your 90-day plan, automation roadmap, GPT briefings, and Campaign DNA.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={finish}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  {saving ? "Saving…" : "View My Strategy Brief →"}
                </button>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-left space-y-2">
                  <p className="text-purple-200 text-sm font-medium">Want the complete package?</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Answering 10 more questions gives us everything needed to build your full campaign, content system, and monetization plan — including Instagram monetization if that is a goal. Skip them if you only want the strategy brief and automation plan.
                  </p>
                  <button
                    onClick={() => { setShowOptional(true); setStep(7); window.scrollTo(0, 0); }}
                    className="w-full border border-purple-500/30 text-purple-300 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-500/10 transition-colors"
                  >
                    Fill in the 10 deep-dive questions →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 7: Optional Deep-Dive (O1–O10) ────────────────── */}
          {step === 7 && (
            <div className="space-y-5">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-purple-300 text-sm">
                  Optional — Powers Campaigns, Social Media, Offers, and Customer Offerings. Skip if you only want the strategy brief and automation plan.
                </p>
              </div>

              <Field
                q="O1" label="What content have you already created that has gotten the strongest response?"
                name="bestContent" value={form.bestContent} onChange={handleChange}
                placeholder="e.g. A reel about why wellness products often erase Indigenous origins got 4,200 views. My audience responds to historical context and authenticity."
                multiline
              />
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O2" label="Top 3–5 keywords your ideal client would search for what you offer"
                  name="contentKeywords" value={form.contentKeywords} onChange={handleChange}
                  placeholder="e.g. ancestral nutrition products, wellness for Black women over 50, natural remedies for inflammation"
                />
                <div className="mt-3">
                  <Field
                    label="Offer-specific keywords"
                    name="offerKeywords" value={form.offerKeywords} onChange={handleChange}
                    placeholder="e.g. detox bundle, heritage supplement, immunity kit"
                  />
                </div>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O3" label="Do you want to monetize Instagram? Describe your current presence."
                  name="instagramDesc" value={form.instagramDesc} onChange={handleChange}
                  placeholder="e.g. 2,800 followers, women 40–60. Reels with historical context outperform everything. I've never made a direct offer on Instagram."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O4" label="Walk through your current lead generation and sales process from first contact to closed sale."
                  name="salesProcess" value={form.salesProcess} onChange={handleChange}
                  placeholder="e.g. Someone finds me on Instagram, clicks bio link, lands on my Shopify store. No email capture, no follow-up sequence."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O5" label="Do you have a lead magnet or freebie? If not, what problem could a free resource solve?"
                  name="leadMagnet" value={form.leadMagnet} onChange={handleChange}
                  placeholder='e.g. No lead magnet yet. A free guide called "5 Ancestral Ingredients Your Grandmother Used" would be perfect.'
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O6" label="What offer tiers do you have or want to build? (Entry, core, premium)"
                  name="offerTiers" value={form.offerTiers} onChange={handleChange}
                  placeholder="e.g. Entry: $27 starter kit. Core: $97 monthly box. Premium: $497 consultation package with curated products."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O7" label="Who are your top 3 competitors or brands you admire, and what do they do better?"
                  name="competitors" value={form.competitors} onChange={handleChange}
                  placeholder="e.g. (1) Nubian Heritage — strong brand story. (2) Anita's Organics — great email marketing. (3) A local herbalist with 40K followers who sells out every drop."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O8" label="What is the hidden fear your ideal client has that stops them from buying?"
                  name="hiddenFear" value={form.hiddenFear} onChange={handleChange}
                  placeholder="e.g. They are afraid of wasting money again. They have been disappointed before and don't want to feel foolish."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O9" label="What are your content creation constraints? Time, tools, what has caused you to stop posting consistently?"
                  name="contentConstraints" value={form.contentConstraints} onChange={handleChange}
                  placeholder="e.g. I can create content for about 2 hours per week. I hate being on camera. I stop posting when I run out of ideas."
                  multiline
                />
              </div>
              <div className="border-t border-slate-800 pt-4">
                <Field
                  q="O10" label="What is the one bottleneck that, if removed, would make everything else easier or faster?"
                  name="scalingBottleneck" value={form.scalingBottleneck} onChange={handleChange}
                  placeholder="e.g. If I had an automated email sequence that turned first-time buyers into repeat customers, I could stop worrying about new acquisition."
                  multiline
                />
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 && step < 6 ? (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 5 && (
            <button
              onClick={next}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Continue"} <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 5 && (
            <button
              onClick={next}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Complete"} <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 7 && (
            <button
              onClick={finishWithOptional}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Submit Everything →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
