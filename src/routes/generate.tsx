import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { generateBusiness, saveBusiness, type BusinessOutput } from "~/lib/ai";
import { getCurrentUser } from "~/lib/auth";

const runGeneration = createServerFn({ method: "POST" })
  .validator((data: { idea: string; focusArea?: string }) => data)
  .handler(async ({ data }) => {
    const result = await generateBusiness(data.idea, data.focusArea);
    const title = result.brand_identity.name_suggestions[0] || "My Business";
    // Try saving to DB (gracefully handles missing DB)
    const user = await getCurrentUser({} as any);
    let saved = null;
    if (user.user) {
      saved = await saveBusiness(user.user.id, title, data.idea, result);
    }
    return { output: result, saved, title };
  });

export const Route = createFileRoute("/generate")({
  component: GeneratePage,
});

const FOCUS_AREAS = ["Tech", "Food", "Service", "Creative", "Health", "Education", "E-commerce", "Other"];

function GeneratePage() {
  const [idea, setIdea] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BusinessOutput | null>(null);
  const [businessTitle, setBusinessTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim().length < 10) {
      setError("Please describe your idea in at least 10 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await runGeneration({ data: { idea: idea.trim(), focusArea: focusArea || undefined } });
      setResult(res.output);
      setBusinessTitle(res.title);
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${businessTitle.replace(/\s+/g, "_")}_business_plan.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-dvh bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚒️</span>
            <span className="text-xl font-bold text-gray-900">IdeaForge</span>
          </a>
          <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Dashboard
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {!result ? (
          <>
            {/* Generate Form */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900">Generate Your Business</h1>
              <p className="mt-2 text-lg text-gray-600">
                Describe your idea and let AI build a complete business plan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              <div className="space-y-5">
                <div>
                  <label htmlFor="idea" className="block text-sm font-medium text-gray-700">
                    Describe your business idea
                  </label>
                  <textarea
                    id="idea"
                    rows={5}
                    required
                    minLength={10}
                    maxLength={500}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="I want to create a mobile app that helps people find local farmers markets and buy fresh produce directly from growers..."
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">{idea.length}/500 characters</p>
                </div>
                <div>
                  <label htmlFor="focus" className="block text-sm font-medium text-gray-700">
                    Focus area (optional)
                  </label>
                  <select
                    id="focus"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Any / Not sure</option>
                    {FOCUS_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating your business plan...
                  </span>
                ) : (
                  "Generate Business Plan"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{businessTitle}</h1>
                <p className="mt-1 text-sm text-gray-500">Your AI-generated business plan</p>
              </div>
              <button
                onClick={() => { setResult(null); setIdea(""); setFocusArea(""); }}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                New generation
              </button>
            </div>

            {/* Business Plan */}
            <Section title="📋 Business Plan">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Executive Summary</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.business_plan.executive_summary}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Market Analysis</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.business_plan.market_analysis}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Operations</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.business_plan.operations}</p>
                </div>
              </div>
            </Section>

            {/* Brand Identity */}
            <Section title="🎨 Brand Identity">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Name Suggestions</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {result.brand_identity.name_suggestions.map((name) => (
                      <span key={name} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">{name}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Tagline</h4>
                  <p className="mt-1 text-sm italic text-gray-600">"{result.brand_identity.tagline}"</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Color Palette</h4>
                  <div className="mt-1 flex flex-wrap gap-3">
                    {result.brand_identity.color_palette.map((color) => (
                      <div key={color} className="flex items-center gap-2">
                        <span className="inline-block h-6 w-6 rounded-full border" style={{ backgroundColor: color }} />
                        <span className="text-xs text-gray-500">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Brand Voice</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.brand_identity.brand_voice}</p>
                </div>
              </div>
            </Section>

            {/* Marketing Strategy */}
            <Section title="📢 Marketing Strategy">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Channels</h4>
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                    {result.marketing_strategy.channels.map((ch) => <li key={ch}>{ch}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Content Plan</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.marketing_strategy.content_plan}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Launch Tactics</h4>
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                    {result.marketing_strategy.launch_tactics.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </Section>

            {/* Financial Overview */}
            <Section title="💰 Financial Overview">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Revenue Model</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.financial_overview.revenue_model}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Cost Estimates</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.financial_overview.cost_estimates}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Break-Even Analysis</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.financial_overview.break_even}</p>
                </div>
              </div>
            </Section>

            {/* Website Copy */}
            <Section title="🌐 Website Copy">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Headline</p>
                  <p className="text-lg font-bold text-gray-900">{result.website_copy.headline}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Subheadline</p>
                  <p className="text-base text-gray-700">{result.website_copy.subheadline}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">About</p>
                  <p className="text-sm text-gray-600">{result.website_copy.about_text}</p>
                </div>
              </div>
            </Section>

            {/* Competitive Analysis */}
            <Section title="🔍 Competitive Analysis">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <h4 className="text-xs font-semibold uppercase text-green-700">Strengths</h4>
                    <ul className="mt-1 list-inside list-disc text-sm text-green-800">
                      {result.competitive_analysis.swot.strengths.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <h4 className="text-xs font-semibold uppercase text-red-700">Weaknesses</h4>
                    <ul className="mt-1 list-inside list-disc text-sm text-red-800">
                      {result.competitive_analysis.swot.weaknesses.map((w) => <li key={w}>{w}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <h4 className="text-xs font-semibold uppercase text-blue-700">Opportunities</h4>
                    <ul className="mt-1 list-inside list-disc text-sm text-blue-800">
                      {result.competitive_analysis.swot.opportunities.map((o) => <li key={o}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    <h4 className="text-xs font-semibold uppercase text-yellow-700">Threats</h4>
                    <ul className="mt-1 list-inside list-disc text-sm text-yellow-800">
                      {result.competitive_analysis.swot.threats.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Differentiation</h4>
                  <p className="mt-1 text-sm text-gray-600">{result.competitive_analysis.differentiation}</p>
                </div>
              </div>
            </Section>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as JSON
              </button>
              <a
                href="/generate"
                onClick={(e) => { e.preventDefault(); setResult(null); setIdea(""); setFocusArea(""); }}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                Generate another
              </a>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}