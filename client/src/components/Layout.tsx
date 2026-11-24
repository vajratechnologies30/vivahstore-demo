import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "@/_core/useAuth";
import { useCart } from "@/lib/cart";
import { trpc } from "@/_core/trpc";

const NAV = [
  { label: "Shop All", href: "/shop" },
  { label: "Wedding Favours", href: "/shop/wedding-favours" },
  { label: "Pooja & Décor", href: "/shop/pooja-decor" },
  { label: "Serveware", href: "/shop/serveware" },
  { label: "Idols & Murtis", href: "/shop/idols-murtis" },
  { label: "Trousseau", href: "/shop/trousseau" },
];

export function Header() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-wine text-ivory">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center px-6 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-ivory/85">
            Complimentary shipping across India on orders above ₹2,999
          </p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled
            ? "border-border bg-ivory/95 backdrop-blur-md"
            : "border-transparent bg-ivory"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5 lg:px-10">
          {/* Left: mobile menu + desktop nav */}
          <div className="flex flex-1 items-center gap-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <nav className="hidden items-center gap-7 lg:flex">
              {NAV.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="link-underline text-[11px] font-medium uppercase tracking-[0.16em] text-ink/80 transition-colors hover:text-wine"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centre: wordmark */}
          <Link to="/" className="group flex flex-col items-center">
            <span className="font-display text-[1.75rem] leading-none tracking-[0.34em] text-wine transition-opacity group-hover:opacity-80">
              VIVAH
            </span>
            <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.42em] text-gold">
              Jaipur
            </span>
          </Link>

          {/* Right: account + cart */}
          <div className="flex flex-1 items-center justify-end gap-5">
            <Link
              to={user ? "/account" : "/login"}
              className="hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/80 transition-colors hover:text-wine sm:flex"
            >
              <User className="h-4 w-4" strokeWidth={1.25} />
              <span>{user ? "Account" : "Sign in"}</span>
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 text-ink/80 transition-colors hover:text-wine"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[9px] font-medium text-ivory">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-ivory p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl tracking-[0.3em] text-wine">VIVAH</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="font-display text-2xl text-ink transition-colors hover:text-wine"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-10 rule-gold" />
            <nav className="mt-8 flex flex-col gap-4">
              <Link to="/about" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Our Story
              </Link>
              <Link to="/contact" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Contact
              </Link>
              <Link to="/policies" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Shipping & Returns
              </Link>
              <Link
                to={user ? "/account" : "/login"}
                className="text-[11px] uppercase tracking-[0.18em] text-wine"
              >
                {user ? "My Account" : "Sign in"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setDone(true);
      setEmail("");
    },
  });

  return (
    <footer className="mt-24 bg-wine-deep text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <span className="font-display text-2xl tracking-[0.34em] text-ivory">VIVAH</span>
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-ivory/60">
              Handcrafted German silver wedding favours, pooja essentials and festive gifting —
              made by Rajasthani artisans in our Jaipur atelier, shipped worldwide.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-gold-soft">
              Manufacturer &amp; Exporter
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">Shop</h4>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm font-light text-ivory/65 transition-colors hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
              The House
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <Link to="/about" className="text-sm font-light text-ivory/65 hover:text-ivory">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm font-light text-ivory/65 hover:text-ivory">
                  Contact &amp; Bulk Orders
                </Link>
              </li>
              <li>
                <Link to="/policies" className="text-sm font-light text-ivory/65 hover:text-ivory">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-sm font-light text-ivory/65 hover:text-ivory">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
              The Vivah Letter
            </h4>
            <p className="mt-5 text-sm font-light leading-relaxed text-ivory/60">
              New collections, festive edits and atelier notes — a few times a year.
            </p>
            {done ? (
              <p className="mt-5 text-sm font-light text-gold-soft">
                Thank you — you're on the list.
              </p>
            ) : (
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) subscribe.mutate({ email: email.trim() });
                }}
              >
                <div className="flex items-center gap-3 border-b border-ivory/25 pb-2 focus-within:border-gold-soft">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full bg-transparent text-sm font-light text-ivory outline-none placeholder:text-ivory/40"
                  />
                  <button
                    type="submit"
                    disabled={subscribe.isPending}
                    className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold-soft transition-opacity hover:opacity-70 disabled:opacity-40"
                  >
                    Join
                  </button>
                </div>
                {subscribe.error && (
                  <p className="mt-2 text-xs text-ivory/50">{subscribe.error.message}</p>
                )}
              </form>
            )}
            <div className="mt-8 space-y-1 text-sm font-light text-ivory/55">
              <p>+91 88241 15005</p>
              <p>Jaipur, Rajasthan, India</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 sm:flex-row">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/35">
            © {new Date().getFullYear()} Vivah Inc. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/35">
            Handcrafted in Jaipur · Shipped Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
