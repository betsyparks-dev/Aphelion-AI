import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser, logout } from "~/lib/auth";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    getCurrentUser().then((result) => {
      if (!result.user) {
        window.location.href = "/login";
        return;
      }
      setUser(result.user);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    const result = await logout();
    if (result.cookie) {
      document.cookie = result.cookie;
    }
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-indigo-200" />
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Dashboard header */}
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚒️</span>
            <span className="text-xl font-bold text-gray-900">IdeaForge</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize">
              {user?.subscription_tier}
            </span>
            <button
              onClick={handleLogout}
              disabled={signingOut}
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </nav>
      </header>

      {/* Dashboard content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name || "Entrepreneur"}! Here you can manage your generated businesses.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <span className="text-3xl">⚒️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            You haven&apos;t generated any businesses yet
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Describe your first idea and let AI build your business plan.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
          >
            Generate your first business
          </a>
        </div>
      </main>
    </div>
  );
}