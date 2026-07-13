import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/thank-you")({
  component: ThankYouPage,
});

function ThankYouPage() {
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

      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Thank you for subscribing!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your subscription is now active. You can start generating businesses right away and
          unlock all the premium features included in your plan.
        </p>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-left">
          <h2 className="text-lg font-semibold text-gray-900">What you get now:</h2>
          <ul className="mt-4 space-y-3">
            {[
              "Generate more businesses per month (or unlimited on Pro)",
              "Detailed financial projections with break-even analysis",
              "Downloadable PDF exports of your business plans",
              "Priority support from our team",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/generate"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-lg"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start generating businesses
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            Go to dashboard
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} IdeaForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}