const SECTIONS = [
  {
    title: "Shipping",
    body: [
      "Orders are dispatched from our Jaipur atelier within 3–5 working days. Personalised pieces — names, monograms, custom boxes — take 7–10 working days.",
      "Shipping within India is complimentary on orders above ₹2,999. Below that, a flat rate of ₹149 applies.",
      "We ship worldwide. International orders are dispatched by tracked courier; duties and import taxes are the responsibility of the recipient.",
    ],
  },
  {
    title: "Returns",
    body: [
      "Unused pieces in their original packaging may be returned within 7 days of delivery for a refund or exchange.",
      "Personalised pieces — engraved names, monograms, custom boxes — cannot be returned unless they arrive damaged or incorrect.",
      "To begin a return, write to the studio with your order number. Return shipping is the responsibility of the customer unless the piece was faulty.",
    ],
  },
  {
    title: "Care",
    body: [
      "German silver is a nickel-copper-zinc alloy. It develops a soft patina over time, which many people prefer; if you want the original brightness back, polish gently with a soft silver cloth.",
      "Avoid abrasive cleaners, prolonged moisture and perfume. Do not put pieces in a dishwasher or microwave.",
      "Store pieces in the suede or velvet box they arrived in — it is made for exactly this.",
    ],
  },
  {
    title: "Payment",
    body: [
      "Orders placed on this site are recorded and confirmed by the studio. No card is charged online.",
      "After you place an order, the studio will contact you by email or WhatsApp to confirm payment and dispatch. Payment is by bank transfer, UPI or the method agreed with the studio.",
      "This means your order is a reservation until payment is confirmed — we will hold it for you while we are in touch.",
    ],
  },
  {
    title: "Bulk & Corporate",
    body: [
      "We manufacture in-house and take orders from ten to several thousand pieces.",
      "Custom motifs, personalised boxes and branded packaging are all possible. Lead times depend on quantity and complexity — write to us with your date and we will confirm.",
    ],
  },
];

export default function Policies() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
      <p className="eyebrow">The Fine Print</p>
      <h1 className="display-lg mt-4 text-wine">Shipping, Returns &amp; Care</h1>
      <p className="mt-5 text-[15px] font-light leading-[1.85] text-ink/65">
        Everything you need to know about how a Vivah piece reaches you, and how to keep it.
      </p>

      <div className="mt-14 space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.title} className="border-t border-border pt-8">
            <h2 className="font-display text-2xl text-wine">{section.title}</h2>
            <div className="mt-4 space-y-4 text-[15px] font-light leading-[1.85] text-ink/70">
              {section.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 border border-border bg-bone/50 p-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">Questions</p>
        <p className="mt-3 text-sm font-light leading-relaxed text-ink/70">
          Write to the studio on WhatsApp at +91 88241 15005, or use the contact page. We reply
          within one working day.
        </p>
      </div>
    </main>
  );
}
