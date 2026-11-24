import { useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/_core/trpc";
import { ProductCard } from "@/components/ProductCard";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "A – Z" },
] as const;

export default function Shop() {
  const params = useParams<{ category?: string }>();
  const category = params.category;
  const [sort, setSort] = useState<(typeof SORTS)[number]["value"]>("featured");

  const categories = trpc.catalog.categories.useQuery();
  const products = trpc.catalog.products.useQuery({ category, sort });
  const active = categories.data?.find((c) => c.slug === category);

  return (
    <main>
      {/* Header */}
      <section className="border-b border-border bg-bone/40">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Link to="/" className="hover:text-wine">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-wine">
              Shop
            </Link>
            {active && (
              <>
                <span>/</span>
                <span className="text-wine">{active.name}</span>
              </>
            )}
          </nav>
          <h1 className="display-lg mt-6 text-wine">
            {active ? active.name : "The Collection"}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-ink/65">
            {active
              ? active.description
              : "Every piece is handcrafted in our Jaipur atelier — German silver, velvet and suede, made to be kept."}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[73px] z-30 border-b border-border bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              to="/shop"
              className={`text-[10px] font-medium uppercase tracking-[0.18em] transition-colors ${
                !category ? "text-wine" : "text-muted-foreground hover:text-wine"
              }`}
            >
              All
            </Link>
            {categories.data?.map((c) => (
              <Link
                key={c.slug}
                to={`/shop/${c.slug}`}
                className={`text-[10px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  category === c.slug ? "text-wine" : "text-muted-foreground hover:text-wine"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {products.data?.length ?? 0} pieces
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-border bg-transparent px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-ink outline-none focus:border-gold"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        {products.isLoading && (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-bone" />
            ))}
          </div>
        )}

        {products.isError && (
          <div className="border border-border bg-card px-8 py-16 text-center">
            <h2 className="font-display text-2xl text-wine">We could not load the collection</h2>
            <p className="mt-3 text-sm font-light text-muted-foreground">
              Please refresh the page. If it persists, write to us at the studio.
            </p>
          </div>
        )}

        {products.data?.length === 0 && (
          <div className="border border-border bg-card px-8 py-20 text-center">
            <p className="eyebrow">Nothing here yet</p>
            <h2 className="mt-4 font-display text-3xl text-wine">This collection is being prepared</h2>
            <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
              New pieces arrive from the atelier every few weeks. In the meantime, the full
              collection is worth a look.
            </p>
            <Link to="/shop" className="btn-wine mt-8">
              View All Pieces
            </Link>
          </div>
        )}

        {products.data && products.data.length > 0 && (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.data.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
