export type DemoCategory = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image: string | null;
  sortOrder: number;
};

export type DemoProduct = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  subtitle: string | null;
  description: string | null;
  story: string | null;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  materials: string | null;
  dimensions: string | null;
  care: string | null;
  badge: string | null;
  isFeatured: boolean;
  isBestseller: boolean;
  stock: number;
  sortOrder: number;
  createdAt: Date;
};

export const demoCategories: DemoCategory[] = [
  {
    id: "cat-wedding-favours",
    slug: "wedding-favours",
    name: "Wedding Favours",
    tagline: "Return gifts that are kept, not shelved",
    description:
      "Handcrafted German silver favours for the guests who made your day. Each piece arrives in a suede or velvet presentation box, ready to gift.",
    image: "/images/vivah_products_v3.png",
    sortOrder: 1,
  },
  {
    id: "cat-pooja-decor",
    slug: "pooja-decor",
    name: "Pooja & Décor",
    tagline: "For the corner of the home that holds everything",
    description:
      "Aarti diyas, thali sets and sacred objects in German silver — made for daily ritual and for the celebrations that gather a family.",
    image: "/images/vivah_products_v2.png",
    sortOrder: 2,
  },
  {
    id: "cat-serveware",
    slug: "serveware",
    name: "Serveware",
    tagline: "The table, dressed for an occasion",
    description:
      "Swan cutlery, enamel pots and silver glass sets — pieces that turn a meal into an occasion and a gift into a keepsake.",
    image: "/images/vivah_products_v8.png",
    sortOrder: 3,
  },
  {
    id: "cat-idols-murtis",
    slug: "idols-murtis",
    name: "Idols & Murtis",
    tagline: "Divine forms, finely wrought",
    description:
      "Kamdhenu, Laxmi-Ganesh and peacock motifs, hand-finished by Rajasthani artisans and embellished with semi-precious stone.",
    image: "/images/vivah_products_v5.png",
    sortOrder: 4,
  },
  {
    id: "cat-trousseau",
    slug: "trousseau",
    name: "Trousseau",
    tagline: "Packed with intention",
    description:
      "Curated hampers and keepsake boxes for the bride, the couple and the home they are building.",
    image: "/images/vivah_products_v9.png",
    sortOrder: 5,
  },
];

const createdAt = new Date("2026-01-01T00:00:00.000Z");

export const demoProducts: DemoProduct[] = [
  {
    id: "prod-german-silver-glass-bottle-set",
    slug: "german-silver-glass-bottle-set",
    name: "German Silver Glass Bottle Set",
    categorySlug: "wedding-favours",
    subtitle: "Set of two, in a suede box",
    description:
      "A pair of slim German silver bottles with a matching tray, presented in a deep wine suede box. The set that has become our most requested wedding favour — substantial in the hand, restrained in design, and useful long after the wedding.",
    story:
      "Each set is finished by hand in our Jaipur workshop: the silver is cast, engraved, then polished over several passes until the surface holds a soft, warm reflection rather than a hard shine. The suede box is made to the same standard as the piece inside it.",
    price: 449900,
    compareAtPrice: 599900,
    images: ["/images/vivah_products_v3.png"],
    materials: "German silver (nickel-silver alloy), suede presentation box",
    dimensions: "Bottle 22 cm height · Tray 26 × 12 cm",
    care: "Wipe with a soft dry cloth. Avoid abrasive cleaners and prolonged moisture.",
    badge: "Most Gifted",
    isFeatured: true,
    isBestseller: true,
    stock: 48,
    sortOrder: 1,
    createdAt,
  },
  {
    id: "prod-goodluck-turtle-velvet-box",
    slug: "goodluck-turtle-velvet-box",
    name: "Good Luck Turtle",
    categorySlug: "wedding-favours",
    subtitle: "With gold acrylic nameplate",
    description:
      "Our most viral piece. A hand-engraved German silver turtle — the symbol of steady fortune — resting on a velvet box that can be personalised with a name or monogram in gold acrylic.",
    story:
      "The turtle is cast in a single piece so the shell engraving runs unbroken from edge to edge. The nameplate is cut and applied by hand, which is why a personalised set takes a few days longer than a plain one.",
    price: 189900,
    compareAtPrice: 249900,
    images: ["/images/vivah_products_v7.png"],
    materials: "German silver, velvet box, gold acrylic nameplate",
    dimensions: "Turtle 9 × 6 cm · Box 14 × 11 cm",
    care: "Dust with a soft cloth. Keep the velvet box closed when not in use.",
    badge: "Bestseller",
    isFeatured: true,
    isBestseller: true,
    stock: 120,
    sortOrder: 2,
    createdAt,
  },
  {
    id: "prod-kamdhenu-cow-stonework",
    slug: "kamdhenu-cow-stonework",
    name: "Kamdhenu Cow with Stone Work",
    categorySlug: "idols-murtis",
    subtitle: "Semi-precious stone detailing",
    description:
      "The Kamdhenu — the wish-fulfilling cow — rendered in German silver and set with small semi-precious stones in the traditional Rajasthani manner. A piece for the pooja room, a housewarming, or a wedding gift that carries a blessing.",
    story:
      "Our artisans set each stone by hand into a silver bezel, a technique that takes years to learn and cannot be rushed. The result is colour that sits inside the metal rather than on top of it.",
    price: 549900,
    compareAtPrice: 699900,
    images: ["/images/vivah_products_v5.png"],
    materials: "German silver, semi-precious stones",
    dimensions: "14 × 9 × 11 cm",
    care: "Wipe gently with a dry cloth. Do not immerse in water.",
    badge: null,
    isFeatured: true,
    isBestseller: false,
    stock: 24,
    sortOrder: 3,
    createdAt,
  },
  {
    id: "prod-elephant-enamel-sugar-pot",
    slug: "elephant-enamel-sugar-pot",
    name: "Elephant Enamel Sugar Pot",
    categorySlug: "serveware",
    subtitle: "Imported, royal enamel",
    description:
      "An elephant-motif sugar pot in deep enamel on silver — a grand object for the dining table and a favourite for housewarmings and corporate gifting.",
    story:
      "The enamel is fired in layers, each one cooled before the next is applied, which is what gives the colour its depth. The elephant lid is cast separately and fitted by hand so it seats with a soft, precise click.",
    price: 389900,
    compareAtPrice: 449900,
    images: ["/images/vivah_products_v10.png"],
    materials: "Enamelled silver, brass fittings",
    dimensions: "12 cm height · 11 cm diameter",
    care: "Hand wash with mild soap. Dry immediately. Not for dishwasher or microwave.",
    badge: null,
    isFeatured: false,
    isBestseller: true,
    stock: 36,
    sortOrder: 4,
    createdAt,
  },
  {
    id: "prod-five-mukhi-aarti-diya",
    slug: "five-mukhi-aarti-diya",
    name: "5 Mukhi Aarti Diya",
    categorySlug: "pooja-decor",
    subtitle: "Five-wick, hand engraved",
    description:
      "A five-faced aarti diya in German silver, engraved with traditional motifs and weighted to sit steady in the hand during aarti. The piece that turns a daily ritual into something worth keeping.",
    story:
      "Five wicks, five flames — the form is traditional, but the engraving is our own: a fine repeating vine that catches the light as the diya moves.",
    price: 229900,
    compareAtPrice: 279900,
    images: ["/images/vivah_products_v4.png"],
    materials: "German silver",
    dimensions: "18 cm width · 6 cm height",
    care: "Wipe with a soft dry cloth after use. Remove wax while warm.",
    badge: null,
    isFeatured: true,
    isBestseller: true,
    stock: 64,
    sortOrder: 5,
    createdAt,
  },
  {
    id: "prod-filigree-photo-frame",
    slug: "filigree-photo-frame",
    name: "Filigree Photo Frame",
    categorySlug: "pooja-decor",
    subtitle: "Hand-cut silver filigree",
    description:
      "A German silver photo frame bordered with hand-cut filigree — for the wedding portrait, the family photograph, or a gift that holds a memory rather than a thing.",
    story:
      "The filigree border is cut from a single sheet and chased by hand; no two frames carry exactly the same pattern. It is the kind of detail that only reveals itself when you hold the piece.",
    price: 279900,
    compareAtPrice: 329900,
    images: ["/images/vivah_products.png"],
    materials: "German silver, glass, velvet backing",
    dimensions: "20 × 15 cm (fits 5 × 7 in)",
    care: "Polish with a soft silver cloth. Keep away from direct sunlight.",
    badge: null,
    isFeatured: false,
    isBestseller: false,
    stock: 30,
    sortOrder: 6,
    createdAt,
  },
  {
    id: "prod-pooja-thali-set-royal-blue",
    slug: "pooja-thali-set-royal-blue",
    name: "Pooja Thali Set",
    categorySlug: "pooja-decor",
    subtitle: "Complete set, royal blue velvet",
    description:
      "A complete pooja thali — engraved tray, bowls, bell, incense holder and diya — presented in a royal blue velvet box. The set we send for Diwali, for weddings, and for the first pooja in a new home.",
    story:
      "Every component is made to fit the tray it travels in, so the set arrives as an arrangement rather than a collection of parts. The velvet box is stitched in Jaipur.",
    price: 649900,
    compareAtPrice: 799900,
    images: ["/images/vivah_products_v2.png"],
    materials: "German silver, royal blue velvet box",
    dimensions: "Tray 30 cm diameter · 7 pieces",
    care: "Wipe each piece with a soft dry cloth. Store in the velvet box.",
    badge: null,
    isFeatured: true,
    isBestseller: true,
    stock: 18,
    sortOrder: 7,
    createdAt,
  },
  {
    id: "prod-swan-spoon-fork-set",
    slug: "swan-spoon-fork-set",
    name: "Swan Spoon & Fork Set",
    categorySlug: "serveware",
    subtitle: "2 holders · 6 spoons · 6 forks",
    description:
      "A fourteen-piece serving set with two sculptural swan holders, six spoons and six forks, in a velvet box that can be personalised with a logo or name. Made for weddings, housewarmings and the tables people remember.",
    story:
      "The swan is the hardest form in our serveware range — the neck has to hold its curve through casting and polishing without losing its line. We reject more of these than we keep.",
    price: 799900,
    compareAtPrice: 949900,
    images: ["/images/vivah_products_v8.png"],
    materials: "German silver, velvet box",
    dimensions: "Holders 16 cm · Spoons 15 cm · Forks 15 cm",
    care: "Hand wash and dry immediately. Store in the velvet box.",
    badge: null,
    isFeatured: true,
    isBestseller: false,
    stock: 14,
    sortOrder: 8,
    createdAt,
  },
  {
    id: "prod-laxmi-ganesh-idol-pair",
    slug: "laxmi-ganesh-idol-pair",
    name: "Laxmi & Ganesh Idol Pair",
    categorySlug: "idols-murtis",
    subtitle: "Gold-plated, finely detailed",
    description:
      "A pair of gold-plated Laxmi and Ganesh idols with fine hand detailing — the gift for a wedding, a new home, a new business, or a client you want to thank properly.",
    story:
      "The pair is finished in gold plate over a silver base, which gives the warmth of gold with the weight and definition of silver underneath.",
    price: 349900,
    compareAtPrice: 419900,
    images: ["/images/vivah_products_v12.png"],
    materials: "Gold-plated silver, velvet base",
    dimensions: "Laxmi 9 cm · Ganesh 10 cm",
    care: "Dust with a soft dry cloth. Avoid water and perfume.",
    badge: null,
    isFeatured: false,
    isBestseller: true,
    stock: 42,
    sortOrder: 9,
    createdAt,
  },
  {
    id: "prod-peacock-bell-swastik-diya",
    slug: "peacock-bell-swastik-diya",
    name: "Peacock Bell & Swastik Diya Set",
    categorySlug: "pooja-decor",
    subtitle: "Two pieces, customised boxes",
    description:
      "A peacock-shaped bell paired with a swastik diya, both engraved in German silver and packed in customised velvet boxes. One of our most shared pieces — and one of the most gifted.",
    story:
      "The peacock bell is tuned by hand: the clapper is filed until the note is clear and warm rather than sharp. It is a small thing that takes a long afternoon.",
    price: 259900,
    compareAtPrice: 319900,
    images: ["/images/vivah_products_v6.png"],
    materials: "German silver, velvet boxes",
    dimensions: "Bell 11 cm · Diya 8 cm",
    care: "Wipe with a soft dry cloth. Store in the velvet box.",
    badge: null,
    isFeatured: false,
    isBestseller: false,
    stock: 52,
    sortOrder: 10,
    createdAt,
  },
  {
    id: "prod-mini-pooja-set",
    slug: "mini-pooja-set",
    name: "Mini Pooja Set",
    categorySlug: "pooja-decor",
    subtitle: "Thali, diya, kalash & bell",
    description:
      "A miniature pooja set — thali, diya, kalash and bell — in a small velvet box. The favour for guests who will actually use it, and the gift for a first home.",
    story:
      "Small pieces are harder than large ones: the engraving has to hold at a fraction of the scale. This set is the most technically demanding thing we make.",
    price: 169900,
    compareAtPrice: 199900,
    images: ["/images/vivah_products_v13.png"],
    materials: "German silver, velvet box",
    dimensions: "Thali 9 cm · 4 pieces",
    care: "Wipe with a soft dry cloth. Store in the velvet box.",
    badge: null,
    isFeatured: false,
    isBestseller: false,
    stock: 88,
    sortOrder: 11,
    createdAt,
  },
  {
    id: "prod-trousseau-keepsake-hamper",
    slug: "trousseau-keepsake-hamper",
    name: "Trousseau Keepsake Hamper",
    categorySlug: "trousseau",
    subtitle: "Curated, in a woven box",
    description:
      "A curated trousseau hamper — a small silver diya, a silver keepsake box, a silk pouch and dried florals, arranged in a woven ivory box lined with wine velvet and tied with a gold ribbon.",
    story:
      "We build each hamper by hand to order, which means the arrangement can be adjusted for the bride, the couple, or the family receiving it. Tell us the occasion and we will compose it accordingly.",
    price: 899900,
    compareAtPrice: 1099900,
    images: ["/images/vivah_products_v9.png"],
    materials: "German silver, silk, dried florals, woven box",
    dimensions: "Box 34 × 26 × 12 cm",
    care: "Keep away from moisture and direct sunlight. Florals are decorative.",
    badge: null,
    isFeatured: true,
    isBestseller: false,
    stock: 10,
    sortOrder: 12,
    createdAt,
  },
];
