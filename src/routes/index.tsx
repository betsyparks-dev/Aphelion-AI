import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-white">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚒️</span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              IdeaForge
            </span>
          </div>
          <div className="hidden items-center gap-8 sm:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Pricing
            </a>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <a
              href="/login"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md"
            >
              Get started free
            </a>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-6 pb-4 pt-2 sm:hidden">
            <div className="flex flex-col gap-3">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <hr className="my-1 border-gray-100" />
              <a href="/login" className="text-sm font-medium text-gray-600">
                Sign in
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white"
              >
                Get started free
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Background gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-purple-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              AI-Powered Business Generation
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
              Turn Your Idea Into a{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Business in Minutes
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Describe your concept once, and let AI generate a complete business
              plan, brand identity, marketing strategy, and financial projections.
              From idea to launch-ready — no expertise required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="/signup"
                className="rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-200"
              >
                Start your free business plan
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • Free plan available
            </p>
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              ["Businesses Generated", "10,000+"],
              ["Active Users", "5,000+"],
              ["Avg. Time to Business", "3 min"],
              ["User Satisfaction", "94%"],
            ].map(([label, stat]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stat}</p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-semibold text-indigo-600">How it works</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Three steps to your next business
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No experience needed. No complicated tools. Just your idea.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Describe Your Idea",
                desc: "Write a few sentences about your business concept. What problem does it solve? Who is it for? Be as brief or detailed as you like.",
                color: "bg-indigo-100 text-indigo-700",
              },
              {
                step: "02",
                title: "AI Generates Your Business",
                desc: "Our AI processes your idea and creates a comprehensive business plan, brand identity, marketing strategy, and financial model — tailored to your concept.",
                color: "bg-purple-100 text-purple-700",
              },
              {
                step: "03",
                title: "Launch & Grow",
                desc: "Download your complete business package. Use it to pitch investors, build your website, start marketing, or simply validate your concept before investing time.",
                color: "bg-pink-100 text-pink-700",
              },
            ].map(({ step, title, desc, color }) => (
              <div
                key={step}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${color}`}
                >
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-gray-50 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-semibold text-indigo-600">Everything you get</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              A complete business, delivered
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Every generated business comes with all the assets you need to get
              started — professionally crafted by AI.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "📋",
                title: "Business Plan",
                desc: "Executive summary, market analysis, competitive landscape, operational plan, and growth strategy.",
              },
              {
                icon: "🎨",
                title: "Brand Identity",
                desc: "Company name suggestions, logo concepts, color palette, typography, and brand voice guidelines.",
              },
              {
                icon: "📢",
                title: "Marketing Strategy",
                desc: "Target audience definition, channel mix, content strategy, launch plan, and KPIs to track.",
              },
              {
                icon: "💰",
                title: "Financial Projections",
                desc: "Revenue forecasts, expense estimates, break-even analysis, and 3-year P&L projections (Starter & Pro).",
              },
              {
                icon: "🌐",
                title: "Website Copy",
                desc: "Complete copy for your landing page, about page, product page, and contact page.",
              },
              {
                icon: "🔍",
                title: "Competitive Analysis",
                desc: "SWOT analysis, competitor positioning maps, and differentiation strategies.",
              },
              {
                icon: "📊",
                title: "Pitch Deck Outline",
                desc: "Slide-by-slide structure for investor presentations with key talking points (Pro).",
              },
              {
                icon: "📱",
                title: "Social Media Kit",
                desc: "Bio templates, content calendar, platform-specific strategies, and post examples (Pro).",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-semibold text-indigo-600">Pricing</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Start free, upgrade when you grow
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Generate your first business free. Unlock premium features when you
              need them.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-6">
            {/* Free Plan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-sm text-gray-500">/mo</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">One free business generation</p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "1 business generation",
                  "Basic business plan",
                  "Brand identity concepts",
                  "Basic marketing strategy",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                            href="/signup"
                            className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                          >
                            Get started free
                          </a>
            </div>

            {/* Starter Plan */}
            <div className="relative rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg shadow-indigo-100">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                Most popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$19</span>
                <span className="text-sm text-gray-500">/mo</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Everything you need to launch
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "10 business generations/mo",
                  "Detailed business plan",
                  "Full brand identity package",
                  "Complete marketing strategy",
                  "Financial projections",
                  "Downloadable PDF exports",
                  "Website copy generation",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                            href="/signup"
                            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md"
                          >
                            Start free trial
                          </a>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-sm text-gray-500">/mo</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                For serious entrepreneurs
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Unlimited business generations",
                  "Everything in Starter, plus:",
                  "Pitch deck outline",
                  "Social media kit",
                  "Detailed financial model",
                  "Competitive analysis",
                  "Priority support",
                  "API access",
                  "Custom branding (logo, colors)",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                            href="/signup"
                            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800"
                          >
                            Subscribe to Pro
                          </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            All plans include a 14-day money-back guarantee. Annual plans save 20%.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your next business is one idea away
          </h2>
          <p className="mt-6 text-lg text-indigo-100">
            Describe your concept. Get a launch-ready business. Start building
            today — it's free.
          </p>
          <div className="mt-10">
            <a
              href="/signup"
              className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-lg"
            >
              Describe your idea — it's free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚒️</span>
              <span className="text-sm font-bold text-gray-900">IdeaForge</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="hover:text-gray-700">
                Contact
              </a>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} IdeaForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}