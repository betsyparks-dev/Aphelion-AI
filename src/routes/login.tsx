import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "~/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login({ data: { email, password } });
      if (result.error) {
        setError(result.error);
      } else if (result.cookie) {
        document.cookie = result.cookie;
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl">⚒️</span>
            <span className="text-xl font-bold text-gray-900">IdeaForge</span>
          </a>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your businesses.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}