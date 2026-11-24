import { Link } from "wouter";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR, shippingFor, FREE_SHIPPING_THRESHOLD } from "@shared/store";

export default function Cart() {
  const { lines, subtotal, setQuantity, remove, count } = useCart();
  const shipping = shippingFor(subtotal);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <p className="eyebrow">Your Selection</p>
      <h1 className="display-lg mt-4 text-wine">The Cart</h1>

      {lines.length === 0 ? (
        <div className="mt-14 border border-border bg-card px-8 py-24 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-gold/50" strokeWidth={1} />
          <h2 className="mt-6 font-display text-3xl text-wine">Nothing selected yet</h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
            Every piece is handcrafted in our Jaipur atelier. Begin with the wedding favour
            collection — our most gifted.
          </p>
          <Link to="/shop" className="btn-wine mt-8">
            Explore the Collection
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {remaining > 0 && (
              <p className="mb-8 border border-gold/30 bg-bone/60 px-5 py-3.5 text-[11px] uppercase tracking-[0.14em] text-wine">
                {formatINR(remaining)} away from complimentary shipping
              </p>
            )}
            <ul className="divide-y divide-border border-y border-border">
              {lines.map((line) => (
                <li key={line.slug} className="flex gap-6 py-7">
                  <Link to={`/product/${line.slug}`} className="shrink-0">
                    <div className="h-36 w-28 overflow-hidden bg-bone">
                      {line.image && (
                        <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/product/${line.slug}`}
                          className="font-display text-xl text-ink hover:text-wine"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-1.5 text-sm font-light text-muted-foreground">
                          {formatINR(line.price)} each
                        </p>
                      </div>
                      <button
                        onClick={() => remove(line.slug)}
                        aria-label={`Remove ${line.name}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          className="px-3 py-2 text-ink/60 hover:text-wine"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="min-w-8 text-center text-xs tabular-nums">{line.quantity}</span>
                        <button
                          onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          className="px-3 py-2 text-ink/60 hover:text-wine"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <span className="text-base tabular-nums text-ink">
                        {formatINR(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/shop"
              className="link-underline mt-8 inline-block text-[10px] font-medium uppercase tracking-[0.18em] text-wine"
            >
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="h-fit border border-border bg-card p-8">
            <h2 className="font-display text-2xl text-wine">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm font-light">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({count} {count === 1 ? "piece" : "pieces"})</span>
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
                <span className="tabular-nums text-wine">{formatINR(subtotal + shipping)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-wine mt-7 w-full">
              Proceed to Checkout
            </Link>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Guest checkout available · No account needed
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
