import { Link } from "wouter";
import { Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <main className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
      <p className="eyebrow">Contact</p>
      <h1 className="display-lg mt-4 max-w-2xl text-wine">
        Bulk orders, personalisation, and anything else.
      </h1>
      <p className="mt-6 max-w-xl text-[15px] font-light leading-[1.85] text-ink/65">
        We manufacture in-house, so custom motifs, personalised boxes and large quantities are all
        possible. Tell us the occasion, the quantity and the date — we will come back with samples
        and a quote.
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-8">
          <a
            href="https://wa.link/p0v30a"
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-5 border border-border bg-card p-7 transition-colors hover:border-gold"
          >
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.25} />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">WhatsApp</p>
              <p className="mt-2 font-display text-xl text-wine group-hover:underline">
                +91 88241 15005
              </p>
              <p className="mt-1 text-sm font-light text-muted-foreground">
                The fastest way to reach the studio
              </p>
            </div>
          </a>

          <a
            href="tel:+918824115005"
            className="group flex items-start gap-5 border border-border bg-card p-7 transition-colors hover:border-gold"
          >
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.25} />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">Phone</p>
              <p className="mt-2 font-display text-xl text-wine group-hover:underline">
                +91 88241 15005
              </p>
              <p className="mt-1 text-sm font-light text-muted-foreground">
                Monday to Saturday, 10am – 7pm IST
              </p>
            </div>
          </a>

          <div className="flex items-start gap-5 border border-border bg-card p-7">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.25} />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">Atelier</p>
              <p className="mt-2 font-display text-xl text-wine">Jaipur, Rajasthan</p>
              <p className="mt-1 text-sm font-light text-muted-foreground">
                Visits by appointment — write ahead
              </p>
            </div>
          </div>

          <div className="border border-border bg-bone/50 p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
              For bulk enquiries
            </p>
            <p className="mt-3 text-sm font-light leading-relaxed text-ink/70">
              Please include: the piece you are interested in, the quantity, the date you need it
              by, and whether you need personalisation. We reply within one working day.
            </p>
          </div>
        </div>

        <div className="border border-border bg-card p-8 lg:p-10">
          <h2 className="font-display text-2xl text-wine">Send a note</h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
            This form opens WhatsApp with your message ready to send — the studio replies there.
          </p>
          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const text = `Hello Vivah —%0A%0AName: ${data.get("name")}%0AOccasion: ${data.get(
                "occasion",
              )}%0AQuantity: ${data.get("quantity")}%0A%0A${data.get("message")}`;
              window.open(`https://wa.me/918824115005?text=${text}`, "_blank");
            }}
          >
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Your name
              </span>
              <input name="name" required className="field mt-1" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Occasion
              </span>
              <input name="occasion" className="field mt-1" placeholder="Wedding, Diwali, corporate…" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Quantity
              </span>
              <input name="quantity" className="field mt-1" placeholder="e.g. 150 sets" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Message
              </span>
              <textarea name="message" rows={4} required className="field mt-1 resize-none" />
            </label>
            <button type="submit" className="btn-wine w-full">
              Open in WhatsApp
            </button>
          </form>
          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Or browse the{" "}
            <Link to="/shop" className="text-wine">
              collection
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
