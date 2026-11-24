import { useState } from "react";
import { Link, useParams } from "wouter";
import { Minus, Plus, Truck, Package, Sparkles } from "lucide-react";
import { trpc } from "@/_core/trpc";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";
import { formatINR, shippingFor, FREE_SHIPPING_THRESHOLD } from "@shared/store";

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data, isLoading, isError } = trpc.catalog.product.useQuery({ slug }, { enabled: !!slug });
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openPanel, setOpenPanel] = useState<string | null>("materials");

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse bg-bone" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse bg-bone" />
            <div className="h-10 w-3/4 animate-pulse bg-bone" />
            <div className="h-4 w-1/2 animate-pulse bg-bone" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-4 font-display text-4xl text-wine">This piece has left the collection</h1>
        <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
          It may have sold out or been retired. The rest of the collection is still here.
        </p>
        <Link to="/shop" className="btn-wine mt-8">
          Back to the Collection
        </Link>
      </main>
    );
  }

  const { product, related } = data;
  const images = product.images?.length ? product.images : [];
  const shipping = shippingFor(product.price);
  const panels = [
    { key: "materials", label: "Materials & Dimensions", body: [product.materials, product.dimensions].filter(Boolean).join(" · ") },
    { key: "care", label: "Care", body: product.care },
    { key: "shipping", label: "Shipping & Returns", body: "Dispatched from Jaipur within 3–5 working days. Complimentary shipping across India above ₹2,999. Worldwide delivery available. Unused pieces in original packaging may be returned within 7 days of delivery." },
  ].filter((p) => p.body);

  return (
    <main>
      <div className="mx-auto max-w-[1400px] px-6 pt-8 lg:px-10">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link to="/" className="hover:text-wine">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-wine">Shop</Link>
          <span>/</span>
          <Link to={`/shop/${product.categorySlug}`} className="hover:text-wine">
            {product.categorySlug.replace(/-/g, " ")}
          </Link>
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10 lg:py-14">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-bone">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Vivah
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-16 overflow-hidden border transition-colors ${
                    i === activeImage ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:pt-4">
          {product.badge && (
            <span className="inline-block bg-wine px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-ivory">
              {product.badge}
            </span>
          )}
          <h1 className="display-lg mt-5 text-wine">{product.name}</h1>
          {product.subtitle && (
            <p className="mt-2 text-[11px] font-light uppercase tracking-[0.16em] text-muted-foreground">
              {product.subtitle}
            </p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink">{formatINR(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gold">
                  Save {formatINR(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Inclusive of all taxes
          </p>

          <p className="mt-7 text-[15px] font-light leading-[1.85] text-ink/70">
            {product.description}
          </p>

          {/* Quantity + add */}
          <div className="mt-9 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-3.5 text-ink/60 hover:text-wine"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <span className="min-w-10 text-center text-sm tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="px-4 py-3.5 text-ink/60 hover:text-wine"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <button
              onClick={() =>
                add(
                  {
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: images[0] ?? null,
                  },
                  qty,
                )
              }
              className="btn-wine flex-1"
            >
              Add to Cart — {formatINR(product.price * qty)}
            </button>
          </div>

          <div className="mt-6 space-y-2.5 border-t border-border pt-6">
            <p className="flex items-center gap-2.5 text-xs font-light text-ink/65">
              <Truck className="h-4 w-4 text-gold" strokeWidth={1.25} />
              {shipping === 0
                ? "Complimentary shipping on this piece"
                : `Shipping ${formatINR(shipping)} · free above ${formatINR(FREE_SHIPPING_THRESHOLD)}`}
            </p>
            <p className="flex items-center gap-2.5 text-xs font-light text-ink/65">
              <Package className="h-4 w-4 text-gold" strokeWidth={1.25} />
              Arrives in a suede or velvet presentation box
            </p>
            <p className="flex items-center gap-2.5 text-xs font-light text-ink/65">
              <Sparkles className="h-4 w-4 text-gold" strokeWidth={1.25} />
              Personalisation available — enquire for names or monograms
            </p>
          </div>

          {/* Accordions */}
          <div className="mt-8 border-t border-border">
            {panels.map((panel) => (
              <div key={panel.key} className="border-b border-border">
                <button
                  onClick={() => setOpenPanel(openPanel === panel.key ? null : panel.key)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
                    {panel.label}
                  </span>
                  <span className="text-gold">{openPanel === panel.key ? "−" : "+"}</span>
                </button>
                {openPanel === panel.key && (
                  <p className="pb-5 text-sm font-light leading-relaxed text-ink/65">{panel.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      {product.story && (
        <section className="border-y border-border bg-bone/40">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-10">
            <p className="eyebrow">The Making</p>
            <p className="mt-6 font-display text-[1.6rem] font-light leading-[1.6] text-wine">
              {product.story}
            </p>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">You may also like</p>
              <h2 className="display-md mt-3 text-wine">From the same collection</h2>
            </div>
            <Link
              to={`/shop/${product.categorySlug}`}
              className="link-underline text-[10px] font-medium uppercase tracking-[0.18em] text-wine"
            >
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
