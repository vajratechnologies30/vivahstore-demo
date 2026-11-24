import { useState, type FormEvent } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/_core/useAuth";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not sign you in.");
    } finally {
      setBusy(false);
    }
  }

  if (user) return <Redirect to="/account" />;

  return (
    <main className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-2">
      <div className="hidden bg-bone lg:block">
        <div className="flex h-full flex-col justify-center px-16 py-24">
          <p className="eyebrow">The House of Vivah</p>
          <h2 className="display-lg mt-5 text-wine">
            Your orders,
            <br />
            kept in one place.
          </h2>
          <p className="mt-6 max-w-sm text-[15px] font-light leading-[1.85] text-ink/65">
            Sign in to see every order you have placed, keep your delivery details ready, and
            check out in a single step next time.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-20 sm:px-16 lg:py-28">
        <div className="mx-auto w-full max-w-sm">
          <p className="eyebrow">Welcome back</p>
          <h1 className="display-md mt-4 text-wine">Sign in</h1>

          <form onSubmit={onSubmit} className="mt-10 space-y-7">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </span>
              <input
                id="email"
                type="email"
                required
                className="field mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Password
              </span>
              <input
                id="password"
                type="password"
                required
                className="field mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-light text-destructive">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-wine w-full">
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-light text-muted-foreground">
            New to Vivah?{" "}
            <Link to="/signup" className="link-underline text-wine">
              Create an account
            </Link>
          </p>
          <p className="mt-6 text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Or{" "}
            <Link to="/checkout" className="text-wine">
              check out as a guest
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
