import { Link } from "wouter";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR, shippingFor, FREE_SHIPPING_THRESHOLD } from "@shared/store";

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, remove, subtotal, count } = useCart();
  const shipping = shippingFor(subtotal);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={closeCart} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-7 py-6">
          <div>
            <p className="eyebrow">Your Selection</p>
            <h2 className="mt-1 font-display text-2xl text-ink">
              {count === 0 ? "Cart" : `${count} ${count === 1 ? "piece" : "pieces"}`}
            </h2>
          </div>
          <button onClick={closeCart} aria-label="Close cart" className="text-ink/60 hover:text-wine">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <ShoppingBag className="h-10 w-10 text-gold/50" strokeWidth={1} />
            <h3 className="mt-6 font-display text-2xl text-ink">Your cart is empty</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
              Every piece is handcrafted in our Jaipur atelier. Begin with the wedding favour
              collection — our most gifted.
            </p>
            <Link to="/shop" onClick={closeCart} className="btn-wine mt-8">
              Explore the Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-7 py-6">
              {remaining > 0 && (
                <p className="mb-6 border border-gold/30 bg-bone/60 px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-wine">
                  {formatINR(remaining)} away from complimentary shipping
                </p>
              )}
              <ul className="space-y-6">
                {lines.map((line) => (
                  <li key={line.slug} className="flex gap-4">
                    <Link to={`/product/${line.slug}`} onClick={closeCart} className="shrink-0">
                      <div className="h-24 w-20 overflow-hidden bg-bone">
                        {line.image ? (
                          <img
                            src={line.image}
                            alt={line.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          to={`/product/${line.slug}`}
                          onClick={closeCart}
                          className="font-display text-lg leading-tight text-ink hover:text-wine"
                        >
                          {line.name}
                        </Link>
                        <button
                          onClick={() => remove(line.slug)}
                          aria-label={`Remove ${line.name}`}
                          className="mt-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-light text-muted-foreground">
                        {formatINR(line.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-3 pt-3">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                            className="px-2.5 py-1.5 text-ink/60 hover:text-wine"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                          <span className="min-w-7 text-center text-xs tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                            className="px-2.5 py-1.5 text-ink/60 hover:text-wine"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <span className="ml-auto text-sm tabular-nums text-ink">
                          {formatINR(line.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-7 py-6">
              <div className="space-y-2 text-sm font-light">
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
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <span className="text-ink">Total</span>
                  <span className="tabular-nums text-wine">{formatINR(subtotal + shipping)}</span>
                </div>
              </div>
              <Link to="/checkout" onClick={closeCart} className="btn-wine mt-6 w-full">
                Proceed to Checkout
              </Link>
              <Link
                to="/cart"
                onClick={closeCart}
                className="mt-3 block text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-wine"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
