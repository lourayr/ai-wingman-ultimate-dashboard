"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import Navigation from "./Navigation";

interface FormData {
  // Step 1
  email: string;
  businessName: string;
  website: string;
  industryModel: string;
  teamStructure: string;
  revenueTrajectory: string;
  // Step 2
  primaryGoal: string;
  biggestChallenge: string;
  techStack: string;
  strengthsGaps: string;
  // Step 3
  investmentCapacity: string;
  successMetrics: string;
  existingAssets: string;
  untappedOpportunity: string;
  // Step 4
  scalingBottleneck: string;
  timeline: string;
  aiComfort: string;
  dreamScenario: string;
  // Step 5
  uvp: string;
  idealClient: string;
  unconventionalApproach: string;
  anythingElse: string;
  // Step 6 DNA
  brandBio: string;
  brandVoice: string;
  bannedWords: string;
  persuasivePremise: string;
  testimonials: string;
  contentKeywords: string;
  offerKeywords: string;
}

const DEFAULT_FORM: FormData = {
  email: "", businessName: "", website: "", industryModel: "", teamStructure: "", revenueTrajectory: "",
  primaryGoal: "", biggestChallenge: "", techStack: "", strengthsGaps: "",
  investmentCapacity: "", successMetrics: "", existingAssets: "", untappedOpportunity: "",
  scalingBottleneck: "", timeline: "", aiComfort: "", dreamScenario: "",
  uvp: "", idealClient: "", unconventionalApproach: "", anythingElse: "",
  brandBio: "", brandVoice: "", bannedWords: "", persuasivePremise: "",
  testimonials: "", contentKeywords: "", offerKeywords: "",
};

const AI_COMFORT_OPTIONS = [
  "Early adopter — I already use AI daily",
  "Curious but cautious — I want to learn",
  "Skeptical — show me it works first",
  "Beginner — starting from scratch",
];

const TIMELINE_OPTIONS = ["30 days", "60 days", "90 days", "6 months", "12 months+"];

const STEPS = [
  { label: "Business Overview", description: "Tell us about your business" },
  { label: "Goals & Challenges", description: "What are you trying to achieve?" },
  { label: "Resources & Assets", description: "What do you have to work with?" },
  { label: "Growth & Scaling", description: "How do you want to grow?" },
  { label: "Identity", description: "What makes you unique?" },
  { label: "Campaign DNA", description: "Power your AI content (optional)" },
];

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  multiline = false,
  required = false,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const base =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm";
  return (
    <div className="space-y-1.5">
      <label className="text-slate-300 text-sm font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={base}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("wingman-onboarding-session");
    if (existing) {
      setSessionId(existing);
      // Try to load existing data
      fetch(`/api/onboarding?session=${existing}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.ok && d.submission) {
            const s = d.submission;
            setFormData({
              email: s.email ?? "",
              businessName: s.business_name ?? "",
              website: s.website ?? "",
              industryModel: s.industry_model ?? "",
              teamStructure: s.team_structure ?? "",
              revenueTrajectory: s.revenue_trajectory ?? "",
              primaryGoal: s.primary_goal ?? "",
              biggestChallenge: s.biggest_challenge ?? "",
              techStack: s.tech_stack ?? "",
              strengthsGaps: s.strengths_gaps ?? "",
              investmentCapacity: s.investment_capacity ?? "",
              successMetrics: s.success_metrics ?? "",
              existingAssets: s.existing_assets ?? "",
              untappedOpportunity: s.untapped_opportunity ?? "",
              scalingBottleneck: s.scaling_bottleneck ?? "",
              timeline: s.timeline ?? "",
              aiComfort: s.ai_comfort ?? "",
              dreamScenario: s.dream_scenario ?? "",
              uvp: s.uvp ?? "",
              idealClient: s.ideal_client ?? "",
              unconventionalApproach: s.unconventional_approach ?? "",
              anythingElse: s.anything_else ?? "",
              brandBio: s.brand_bio ?? "",
              brandVoice: s.brand_voice ?? "",
              bannedWords: s.banned_words ?? "",
              persuasivePremise: s.persuasive_premise ?? "",
              testimonials: s.testimonials ?? "",
              contentKeywords: s.content_keywords ?? "",
              offerKeywords: s.offer_keywords ?? "",
            });
            setStep(s.current_step ?? 0);
          }
        })
        .catch(() => {});
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem("wingman-onboarding-session", newId);
      setSessionId(newId);
    }
  }, []);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveToDb = async (status: "draft" | "complete") => {
    if (!sessionId) return;
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status, currentStep: step, ...formData }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveToDb("draft");
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await saveToDb("complete");
      router.push(`/onboarding/summary?session=${sessionId}`);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Client Onboarding
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {STEPS[step].description} — Step {step + 1} of {STEPS.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            {STEPS.map((s, i) => (
              <span
                key={s.label}
                className={i === step ? "text-purple-400 font-medium" : i < step ? "text-green-400" : ""}
              >
                {i < step ? "✓" : i + 1}
              </span>
            ))}
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <div className="glass rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">{STEPS[step].label}</h2>

          {step === 0 && (
            <>
              <Field label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              <Field label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Your Business Name" required />
              <Field label="Website" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourbusiness.com" />
              <Field label="Industry & Business Model" name="industryModel" value={formData.industryModel} onChange={handleChange} placeholder="e.g. B2B SaaS / E-commerce / Consulting" multiline />
              <Field label="Team Structure" name="teamStructure" value={formData.teamStructure} onChange={handleChange} placeholder="e.g. Solo founder, 5 FTE + contractors" />
              <Field label="Revenue & Growth Trajectory" name="revenueTrajectory" value={formData.revenueTrajectory} onChange={handleChange} placeholder="e.g. $500K ARR, growing 40% YoY" />
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Primary Goal (Next 90 Days)" name="primaryGoal" value={formData.primaryGoal} onChange={handleChange} placeholder="What's your most important outcome?" multiline required />
              <Field label="Biggest Challenge" name="biggestChallenge" value={formData.biggestChallenge} onChange={handleChange} placeholder="What's holding you back the most?" multiline required />
              <Field label="Current Tech Stack" name="techStack" value={formData.techStack} onChange={handleChange} placeholder="e.g. Shopify, HubSpot, Slack, Notion" multiline />
              <Field label="Team Strengths & Gaps" name="strengthsGaps" value={formData.strengthsGaps} onChange={handleChange} placeholder="Where does your team excel? Where do you need help?" multiline />
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Investment Capacity (for AI systems)" name="investmentCapacity" value={formData.investmentCapacity} onChange={handleChange} placeholder="e.g. $2,000–$5,000 / month" />
              <Field label="How Does Success Look in 90 Days?" name="successMetrics" value={formData.successMetrics} onChange={handleChange} placeholder="Specific, measurable outcomes" multiline />
              <Field label="Existing Data & Assets" name="existingAssets" value={formData.existingAssets} onChange={handleChange} placeholder="CRM data, email list, content library, etc." multiline />
              <Field label="Biggest Untapped Opportunity" name="untappedOpportunity" value={formData.untappedOpportunity} onChange={handleChange} placeholder="What could generate the most revenue if you had more bandwidth?" multiline />
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Biggest Scaling Bottleneck" name="scalingBottleneck" value={formData.scalingBottleneck} onChange={handleChange} placeholder="What breaks first when you grow?" multiline />
              <div className="space-y-1.5">
                <label className="text-slate-300 text-sm font-medium">Implementation Timeline</label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleChange("timeline", opt)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        formData.timeline === opt
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "border-slate-700 text-slate-400 hover:border-purple-500 hover:text-purple-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 text-sm font-medium">AI & Automation Comfort Level</label>
                <div className="space-y-2">
                  {AI_COMFORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleChange("aiComfort", opt)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                        formData.aiComfort === opt
                          ? "bg-purple-600/20 border-purple-500 text-purple-300"
                          : "border-slate-700 text-slate-400 hover:border-purple-500/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Dream Scenario (3 Years Out)" name="dreamScenario" value={formData.dreamScenario} onChange={handleChange} placeholder="If everything went perfectly, what would your business look like?" multiline />
            </>
          )}

          {step === 4 && (
            <>
              <Field label="Unique Value Proposition" name="uvp" value={formData.uvp} onChange={handleChange} placeholder="What do you do that no one else does?" multiline required />
              <Field label="Ideal Client Profile" name="idealClient" value={formData.idealClient} onChange={handleChange} placeholder="Who gets the most value from working with you?" multiline />
              <Field label="Your Unconventional Approach" name="unconventionalApproach" value={formData.unconventionalApproach} onChange={handleChange} placeholder="How do you do things differently?" multiline />
              <Field label="Anything Else We Should Know" name="anythingElse" value={formData.anythingElse} onChange={handleChange} placeholder="Any context that would help us serve you better" multiline />
            </>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-purple-300 text-sm">
                  Optional — Powers GhostwriterOS. Skip if you just want the strategy brief.
                </p>
              </div>
              <Field label="Brand Bio" name="brandBio" value={formData.brandBio} onChange={handleChange} placeholder="1–3 sentence brand story" multiline />
              <Field label="Brand Voice" name="brandVoice" value={formData.brandVoice} onChange={handleChange} placeholder="e.g. Direct, empowering, slightly edgy — never corporate" multiline />
              <Field label="Banned Words / Phrases" name="bannedWords" value={formData.bannedWords} onChange={handleChange} placeholder="Words or phrases to never use" />
              <Field label="Persuasive Premise" name="persuasivePremise" value={formData.persuasivePremise} onChange={handleChange} placeholder="Core belief your audience shares" multiline />
              <Field label="Testimonials / Social Proof" name="testimonials" value={formData.testimonials} onChange={handleChange} placeholder="Key results or quotes from clients/customers" multiline />
              <Field label="Content Keywords" name="contentKeywords" value={formData.contentKeywords} onChange={handleChange} placeholder="Topics and keywords to focus content around" />
              <Field label="Offer Keywords" name="offerKeywords" value={formData.offerKeywords} onChange={handleChange} placeholder="Keywords specific to your offer/product" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-green-400 text-xs flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
            <button
              onClick={handleNext}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? "Saving..." : step === STEPS.length - 1 ? "Complete" : "Next"}
              {!saving && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
