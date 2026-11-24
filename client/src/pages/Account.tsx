import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Package, LogOut, Check } from "lucide-react";
import { trpc } from "@/_core/trpc";
import { useAuth } from "@/_core/useAuth";
import { formatINR, ORDER_STATUS_LABEL } from "@shared/store";

type ProfileForm = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

const EMPTY: ProfileForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function Account() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const profile = trpc.profile.get.useQuery();
  const orders = trpc.orders.mine.useQuery();
  const save = trpc.profile.save.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2600);
    },
  });

  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile.data) return;
    setForm({
      fullName: profile.data.fullName ?? "",
      phone: profile.data.phone ?? "",
      addressLine1: profile.data.addressLine1 ?? "",
      addressLine2: profile.data.addressLine2 ?? "",
      city: profile.data.city ?? "",
      state: profile.data.state ?? "",
      pincode: profile.data.pincode ?? "",
      country: profile.data.country ?? "India",
    });
  }, [profile.data]);

  function set<K extends keyof ProfileForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await save.mutateAsync(form);
  }

  async function onLogout() {
    await logout();
    navigate("/");
  }

  const orderCount = orders.data?.length ?? 0;

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">My Account</p>
          <h1 className="display-lg mt-4 text-wine">
            {form.fullName || user?.name || "Welcome back"}
          </h1>
          <p className="mt-3 text-sm font-light text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-wine"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
          Log out
        </button>
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_1.35fr]">
        {/* Profile */}
        <section>
          <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold">
            Your details
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
            Saved here so checkout is one step shorter next time.
          </p>
          <form onSubmit={onSubmit} className="mt-7 grid gap-6 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Full name
              </span>
              <input
                className="field mt-1"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Ananya Sharma"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Phone
              </span>
              <input
                className="field mt-1"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Address
              </span>
              <input
                className="field mt-1"
                value={form.addressLine1}
                onChange={(e) => set("addressLine1", e.target.value)}
                placeholder="House / flat, street"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Apartment, landmark
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
              <input className="field mt-1" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                State
              </span>
              <input className="field mt-1" value={form.state} onChange={(e) => set("state", e.target.value)} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                PIN code
              </span>
              <input
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
                className="field mt-1"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </label>

            <div className="sm:col-span-2">
              {save.error && (
                <p className="mb-4 text-sm font-light text-destructive">{save.error.message}</p>
              )}
              <button type="submit" disabled={save.isPending} className="btn-wine">
                {save.isPending ? "Saving…" : "Save Details"}
              </button>
              {saved && (
                <span className="ml-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-gold">
                  <Check className="h-3.5 w-3.5" strokeWidth={2} /> Saved
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Orders */}
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold">
              Order history
            </h2>
            {orderCount > 0 && (
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {orderCount} {orderCount === 1 ? "order" : "orders"}
              </span>
            )}
          </div>

          {orders.isLoading && (
            <div className="mt-7 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse bg-bone" />
              ))}
            </div>
          )}

          {orders.data?.length === 0 && (
            <div className="mt-7 border border-border bg-card px-8 py-16 text-center">
              <Package className="mx-auto h-9 w-9 text-gold/50" strokeWidth={1} />
              <h3 className="mt-5 font-display text-2xl text-wine">No orders yet</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
                When you place an order while signed in, it will appear here — with its pieces,
                total and status — every time you come back.
              </p>
              <Link to="/shop" className="btn-wine mt-7">
                Explore the Collection
              </Link>
            </div>
          )}

          <div className="mt-7 space-y-5">
            {orders.data?.map(({ order, items }) => (
              <article key={order.id} className="border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
                  <div>
                    <p className="font-display text-lg text-wine">{order.orderNumber}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-gold">
                      {ORDER_STATUS_LABEL[order.status] ?? order.status}
                    </p>
                    <p className="mt-0.5 text-sm tabular-nums text-ink">{formatINR(order.total)}</p>
                  </div>
                </div>
                <ul className="divide-y divide-border px-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 py-4">
                      <div className="h-16 w-14 shrink-0 overflow-hidden bg-bone">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.productSlug}`}
                          className="font-display text-base text-ink hover:text-wine"
                        >
                          {item.productName}
                        </Link>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm tabular-nums text-ink">{formatINR(item.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border px-6 py-3.5">
                  <Link
                    to={`/order/${order.orderNumber}`}
                    className="link-underline text-[10px] font-medium uppercase tracking-[0.16em] text-wine"
                  >
                    View order details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
