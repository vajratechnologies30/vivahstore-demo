import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Lock, UserRound } from "lucide-react";
import { trpc } from "@/_core/trpc";
import { useAuth } from "@/_core/useAuth";
import { useCart } from "@/lib/cart";
import { formatINR, shippingFor } from "@shared/store";

type Form = {
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes: string;
};

const EMPTY: Form = {
  customerName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  notes: "",
};

export default function Checkout() {
  const { user } = useAuth();
  const { lines, subtotal, clear } = useCart();
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const profile = trpc.profile.get.useQuery(undefined, { enabled: !!user });
  const place = trpc.orders.place.useMutation();

  // Pre-fill from the signed-in customer's saved profile.
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      customerName: prev.customerName || profile.data?.fullName || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || profile.data?.phone || "",
      addressLine1: prev.addressLine1 || profile.data?.addressLine1 || "",
      addressLine2: prev.addressLine2 || profile.data?.addressLine2 || "",
      city: prev.city || profile.data?.city || "",
      state: prev.state || profile.data?.state || "",
      pincode: prev.pincode || profile.data?.pincode || "",
      country: prev.country || profile.data?.country || "India",
    }));
  }, [user, profile.data]);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  function set<K extends keyof Form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    try {
      const result = await place.mutateAsync({
        ...form,
        addressLine2: form.addressLine2 || undefined,
        notes: form.notes || undefined,
        items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
      });
      clear();
      navigate(`/order/${result.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not place your order. Please try again.");
    }
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-4 font-display text-4xl text-wine">Your cart is empty</h1>
        <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
          Add a piece to your cart and the checkout will open here.
        </p>
        <Link to="/shop" className="btn-wine mt-8">
          Explore the Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <p className="eyebrow">Checkout</p>
      <h1 className="display-lg mt-4 text-wine">Where shall we send it?</h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={onSubmit}>
          {/* Account state */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-border bg-card px-6 py-5">
            {user ? (
              <p className="flex items-center gap-2.5 text-sm font-light text-ink/70">
                <UserRound className="h-4 w-4 text-gold" strokeWidth={1.25} />
                Ordering as <span className="text-wine">{user.email}</span> — this order will be
                saved to your account.
              </p>
            ) : (
              <>
                <p className="flex items-center gap-2.5 text-sm font-light text-ink/70">
                  <Lock className="h-4 w-4 text-gold" strokeWidth={1.25} />
                  Checking out as a guest — no account needed.
                </p>
                <Link
                  to="/login"
                  className="link-underline text-[10px] font-medium uppercase tracking-[0.18em] text-wine"
                >
                  Sign in to save this order
                </Link>
              </>
            )}
          </div>

          <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold">
            Contact
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Full name
              </span>
              <input
                required
                className="field mt-1"
                value={form.customerName}
                onChange={(e) => set("customerName", e.target.value)}
                placeholder="Ananya Sharma"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </span>
              <input
                required
                type="email"
                className="field mt-1"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Phone
              </span>
              <input
                required
                className="field mt-1"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <h2 className="mt-12 text-[10px] font-medium uppercase tracking-[0.22em] text-gold">
            Shipping address
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Address
              </span>
              <input
                required
                className="field mt-1"
                value={form.addressLine1}
                onChange={(e) => set("addressLine1", e.target.value)}
                placeholder="House / flat, street"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Apartment, landmark (optional)
              </span>
              <input
                className="field mt-1"
                value={form.addressLine2}
                onChange={(e) => set("addressLine2", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                City
              </span>
              <input
                required
                className="field mt-1"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                State / Province
              </span>
              <input
                required
                className="field mt-1"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                PIN / Postal code
              </span>
              <input
                required
                className="field mt-1"
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Country
              </span>
              <input
                required
                className="field mt-1"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Notes for the studio (optional)
              </span>
              <textarea
                rows={3}
                className="field mt-1 resize-none"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Personalisation, delivery instructions, gifting notes…"
              />
            </label>
          </div>

          {error && (
            <p className="mt-8 border border-destructive/30 bg-destructive/5 px-5 py-3.5 text-sm font-light text-destructive">
              {error}
            </p>
          )}

          <button type="submit" disabled={place.isPending} className="btn-wine mt-10 w-full">
            {place.isPending ? "Placing your order…" : `Place Order — ${formatINR(total)}`}
          </button>
          <p className="mt-4 text-center text-[10px] leading-relaxed uppercase tracking-[0.12em] text-muted-foreground">
            No payment is taken online. The studio will confirm payment and dispatch by email or
            WhatsApp.
          </p>
        </form>

        {/* Summary */}
        <aside className="h-fit border border-border bg-card p-8">
          <h2 className="font-display text-2xl text-wine">Your Order</h2>
          <ul className="mt-6 space-y-5">
            {lines.map((line) => (
              <li key={line.slug} className="flex gap-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-bone">
                  {line.image && (
                    <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-display text-base leading-tight text-ink">{line.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Qty {line.quantity}
                  </p>
                </div>
                <span className="text-sm tabular-nums text-ink">
                  {formatINR(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-7 space-y-3 border-t border-border pt-6 text-sm font-light">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums text-ink">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="tabular-nums text-ink">
                {shipping === 0 ? "Complimentary" : formatINR(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-base">
              <span className="text-ink">Total</span>
              <span className="tabular-nums text-wine">{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
