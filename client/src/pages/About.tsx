import { Link } from "wouter";
import { IMG } from "@/lib/images";

export default function About() {
  return (
    <main>
      <section className="bg-bone/50">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
          <p className="eyebrow">Our Story</p>
          <h1 className="display-xl mt-6 max-w-3xl text-wine">
            A house built on
            <br />
            <em className="italic">three hundred years</em>
            <br />
            of Jaipur craft.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="aspect-[4/5] overflow-hidden bg-bone">
            <img src={IMG.hero} alt="Vivah atelier collection" className="h-full w-full object-cover" />
          </div>
          <div className="lg:pt-8">
            <div className="space-y-6 text-[15px] font-light leading-[1.9] text-ink/70">
              <p className="font-display text-2xl leading-[1.5] text-wine">
                Vivah began with a simple observation: the return favour is the one object from a
                wedding that every guest takes home — and almost always the one that is thrown away.
              </p>
              <p>
                We are a manufacturer and exporter based in Jaipur, Rajasthan, working with the
                families who have cast and engraved metal in this city for generations. Our
                workshop makes German silver objects for weddings, pooja rooms and festive gifting —
                and we make them to a standard that assumes they will be kept.
              </p>
              <p>
                German silver is not silver at all, but a nickel-copper-zinc alloy that takes
                engraving beautifully and holds a warm, soft reflection. It is the material of
                Indian ritual objects: durable, repairable, and honest about what it is. We use it
                because it lets a piece be both affordable and genuinely well made.
              </p>
              <p>
                Every set leaves the atelier in a suede or velvet box, made to the same standard as
                the piece inside it. Names and monograms are cut in gold acrylic and applied by
                hand. Nothing is outsourced, which is why a wedding order of three hundred sets is
                the same object as the one in the photograph.
              </p>
              <p>
                Today more than 245,000 people follow the work on Instagram, and we ship to the
                United States, the United Kingdom, the UAE and beyond. What has not changed is the
                bench, the light, and the six pairs of hands every piece passes through.
              </p>
            </div>
            <Link to="/shop" className="btn-wine mt-10">
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-ivory">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-border sm:grid-cols-3">
          {[
            ["The Caster", "The form is poured and cooled, then cleaned by hand."],
            ["The Engraver", "Every motif is cut with a chisel, not stamped."],
            ["The Setter", "Semi-precious stones are bezel-set one at a time."],
            ["The Polisher", "Several passes until the surface holds a soft light."],
            ["The Packer", "Suede and velvet boxes, stitched in Jaipur."],
            ["The Check", "Every piece is held to the light before it leaves."],
          ].map(([title, copy]) => (
            <div key={title} className="bg-ivory px-8 py-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold">{title}</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-ink/65">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <p className="eyebrow">Visit the Atelier</p>
        <h2 className="display-lg mt-4 text-wine">Jaipur, Rajasthan</h2>
        <p className="mt-6 text-[15px] font-light leading-[1.9] text-ink/65">
          We work with couples, families and corporate clients on bespoke orders — custom motifs,
          personalised boxes, and quantities from ten to several thousand. Write to us and we will
          send samples.
        </p>
        <Link to="/contact" className="btn-outline mt-9">
          Enquire
        </Link>
      </section>
    </main>
  );
}
