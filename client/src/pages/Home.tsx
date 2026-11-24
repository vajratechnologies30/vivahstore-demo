import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/_core/trpc";
import { ProductCard } from "@/components/ProductCard";
import { IMG } from "@/lib/images";

const OCCASIONS = [
  {
    title: "The Wedding",
    copy: "Return favours for the guests who travelled for you.",
    href: "/shop/wedding-favours",
    image: IMG.bottleSet,
  },
  {
    title: "The New Home",
    copy: "A pooja set for the first morning in a new house.",
    href: "/shop/pooja-decor",
    image: IMG.poojaThali,
  },
  {
    title: "The Festival",
    copy: "Diyas and idols for the season of light.",
    href: "/shop/idols-murtis",
    image: IMG.aartiDiya,
  },
  {
    title: "The Trousseau",
    copy: "Hampers packed with intention for the bride.",
    href: "/shop/trousseau",
    image: IMG.trousseau,
  },
];

export default function Home() {
  const featured = trpc.catalog.featured.useQuery();
  const bestsellers = trpc.catalog.bestsellers.useQuery();
  const categories = trpc.catalog.categories.useQuery();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-bone">
        <div className="mx-auto grid max-w-[1400px] items-center gap-0 lg:grid-cols-[1fr_1.15fr]">
          <div className="order-2 px-6 py-16 lg:order-1 lg:px-14 lg:py-28">
            <p className="eyebrow fade-up">Handcrafted in Jaipur</p>
            <h1 className="display-xl mt-6 text-wine fade-up" style={{ animationDelay: "0.1s" }}>
              Gifts that
              <br />
              <em className="font-light italic">outlive</em> the
              <br />
              occasion.
            </h1>
            <p
              className="body-lg mt-8 max-w-md text-ink/70 fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              German silver wedding favours, pooja essentials and festive gifting — made by
              Rajasthani artisans, presented in velvet and suede, and shipped worldwide.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/shop" className="btn-wine">
                Shop the Collection
              </Link>
              <Link
                to="/about"
                className="link-underline text-[11px] font-medium uppercase tracking-[0.18em] text-wine"
              >
                Our Story
              </Link>
            </div>
            <div className="mt-14 flex items-center gap-8 border-t border-gold/25 pt-6">
              <div>
                <p className="font-display text-2xl text-wine">245K</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Community
                </p>
              </div>
              <div className="h-8 w-px bg-gold/25" />
              <div>
                <p className="font-display text-2xl text-wine">Worldwide</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Shipping
                </p>
              </div>
              <div className="h-8 w-px bg-gold/25" />
              <div>
                <p className="font-display text-2xl text-wine">Hand</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Finished
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[5/6]">
              <img
                src={IMG.hero}
                alt="Vivah German silver collection on ivory linen"
                className="hero-img h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Promise strip ────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-ivory">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Handcrafted", "Cast, engraved and polished by hand in Jaipur"],
            ["Presentation", "Every piece in a suede or velvet box"],
            ["Personalisation", "Names and monograms in gold acrylic"],
            ["Worldwide", "Shipped to the US, UK, UAE and beyond"],
          ].map(([title, copy]) => (
            <div key={title} className="bg-ivory px-8 py-9">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold">{title}</p>
              <p className="mt-2.5 text-sm font-light leading-relaxed text-ink/65">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collections ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">The Collections</p>
            <h2 className="display-lg mt-4 text-wine">Five houses of craft</h2>
          </div>
          <Link
            to="/shop"
            className="link-underline flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-wine"
          >
            View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-bone" />
            ))}
          {categories.data?.slice(0, 3).map((cat) => (
            <Link key={cat.slug} to={`/shop/${cat.slug}`} className="group relative block overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden bg-bone">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/80 via-wine-deep/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-display text-2xl text-ivory">{cat.name}</h3>
                <p className="mt-1.5 max-w-xs text-xs font-light leading-relaxed text-ivory/70">
                  {cat.tagline}
                </p>
                <span className="mt-4 inline-block text-[10px] font-medium uppercase tracking-[0.2em] text-gold-soft">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {categories.data?.slice(3, 5).map((cat) => (
            <Link key={cat.slug} to={`/shop/${cat.slug}`} className="group relative block overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden bg-bone">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/80 via-wine-deep/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-display text-2xl text-ivory">{cat.name}</h3>
                <p className="mt-1.5 text-xs font-light text-ivory/70">{cat.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────────── */}
      <section className="bg-bone/50 py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="text-center">
            <p className="eyebrow">The Edit</p>
            <h2 className="display-lg mt-4 text-wine">Pieces we are proud of</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-ink/60">
              A short list from the atelier — the pieces our artisans ask to make again.
            </p>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-bone" />
              ))}
            {featured.data?.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Craft story ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden bg-bone">
              <img
                src={IMG.kamdhenu}
                alt="Kamdhenu cow in German silver with stone work"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden h-40 w-40 overflow-hidden border-8 border-ivory bg-bone lg:block">
              <img src={IMG.miniPooja} alt="Mini pooja set" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="eyebrow">The Atelier</p>
            <h2 className="display-lg mt-4 text-wine">
              Made slowly,
              <br />
              in a city that
              <br />
              <em className="italic">knows how.</em>
            </h2>
            <div className="mt-8 space-y-5 text-[15px] font-light leading-[1.85] text-ink/70">
              <p>
                Jaipur has been casting and engraving metal for three hundred years. Our workshop
                sits inside that lineage — the same techniques, the same patience, applied to
                objects made for a wedding rather than a palace.
              </p>
              <p>
                Each piece passes through six pairs of hands: the caster, the engraver, the stone
                setter, the polisher, the packer, and the person who checks it against the light
                before it leaves. Nothing is rushed, because a return favour is kept for decades.
              </p>
            </div>
            <Link to="/about" className="btn-outline mt-10">
              Read the Full Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bestsellers ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-ivory py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Most Gifted</p>
              <h2 className="display-lg mt-4 text-wine">The ones that keep selling out</h2>
            </div>
            <Link
              to="/shop"
              className="link-underline flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-wine"
            >
              Shop all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-bone" />
              ))}
            {bestsellers.data?.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Occasions ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">Gift by Occasion</p>
          <h2 className="display-lg mt-4 text-wine">For the moment you are marking</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((o) => (
            <Link key={o.title} to={o.href} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-bone">
                <img
                  src={o.image}
                  alt={o.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>
              <h3 className="mt-5 font-display text-xl text-ink transition-colors group-hover:text-wine">
                {o.title}
              </h3>
              <p className="mt-1.5 text-xs font-light leading-relaxed text-muted-foreground">
                {o.copy}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bulk / corporate ─────────────────────────────────────────────── */}
      <section className="bg-wine text-ivory">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:px-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold-soft">
              Bulk &amp; Corporate
            </p>
            <h2 className="display-lg mt-5 text-ivory">
              Two hundred favours.
              <br />
              One consistent standard.
            </h2>
            <p className="mt-6 max-w-lg text-[15px] font-light leading-[1.85] text-ivory/70">
              We manufacture in-house, which means a wedding order of 300 sets is the same piece as
              the one in the photograph — not a cheaper version of it. Personalisation, custom
              boxes and worldwide dispatch are all handled by us.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-gold-soft bg-gold-soft px-9 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-wine-deep transition-colors hover:bg-ivory"
              >
                Enquire About Bulk
              </Link>
              <a
                href="https://wa.link/p0v30a"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center border border-ivory/30 px-9 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:border-ivory"
              >
                WhatsApp the Studio
              </a>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={IMG.swanCutlery}
              alt="Swan spoon and fork set in velvet box"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Instagram strip ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">@vivah.inc</p>
          <h2 className="display-lg mt-4 text-wine">From the studio</h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light text-ink/60">
            245,000 people follow the work as it leaves the bench.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[IMG.turtle, IMG.sugarPot, IMG.peacockBell, IMG.photoFrame, IMG.laxmiGanesh, IMG.aartiDiya].map(
            (src, i) => (
              <a
                key={i}
                href="https://www.instagram.com/vivah.inc"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden bg-bone"
              >
                <img
                  src={src}
                  alt="Vivah studio"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-wine-deep/0 transition-colors duration-500 group-hover:bg-wine-deep/25" />
              </a>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
