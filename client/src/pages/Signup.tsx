import { useState, type FormEvent } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/_core/useAuth";

export default function Signup() {
  const { signup, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signup(email, password, name || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not create your account.");
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
            An account,
            <br />
            for the pieces
            <br />
            you keep.
          </h2>
          <p className="mt-6 max-w-sm text-[15px] font-light leading-[1.85] text-ink/65">
            Save your delivery details, follow every order from the atelier to your door, and
            return to your history whenever you need it.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-20 sm:px-16 lg:py-28">
        <div className="mx-auto w-full max-w-sm">
          <p className="eyebrow">Create an account</p>
          <h1 className="display-md mt-4 text-wine">Join the house</h1>

          <form onSubmit={onSubmit} className="mt-10 space-y-7">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Name
              </span>
              <input
                id="name"
                className="field mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Sharma"
              />
            </label>
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
                minLength={8}
                className="field mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </label>

            {error && (
              <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-light text-destructive">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-wine w-full">
              {busy ? "Creating your account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-light text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="link-underline text-wine">
              Sign in
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
