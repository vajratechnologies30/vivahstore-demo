// Demo data-access layer (no database). Catalogue comes from static data and
// orders/profile/newsletter are kept in-memory for the running server process.
import { demoCategories, demoProducts, type DemoCategory, type DemoProduct } from "./demo-catalogue";

export type CategoryRow = DemoCategory;
export type ProductRow = DemoProduct;

type OrderItemRow = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productSlug: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type OrderRow = {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: Date;
};

type ProfileRow = {
  id: string;
  userId: string;
  fullName: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

const demoOrders = new Map<string, { order: OrderRow; items: OrderItemRow[] }>();
const demoProfiles = new Map<string, ProfileRow>();
const demoNewsletter = new Set<string>();

function sortProducts(rows: ProductRow[], sort?: string) {
  const copy = [...rows];
  if (sort === "price-asc") return copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price);
  if (sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

// ── Catalogue ────────────────────────────────────────────────────────────────

export async function listCategories() {
  return [...demoCategories].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export async function listProducts(opts: { category?: string; sort?: string } = {}) {
  const filtered = opts.category
    ? demoProducts.filter((p) => p.categorySlug === opts.category)
    : demoProducts;
  return sortProducts(filtered, opts.sort);
}

export async function getProductBySlug(slug: string) {
  return demoProducts.find((p) => p.slug === slug) ?? null;
}

export async function listFeatured(limit = 4) {
  return demoProducts
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export async function listBestsellers(limit = 4) {
  return demoProducts
    .filter((p) => p.isBestseller)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export async function listRelated(categorySlug: string, excludeSlug: string, limit = 4) {
  return demoProducts
    .filter((p) => p.categorySlug === categorySlug && p.slug !== excludeSlug)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export async function getProductsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  const wanted = new Set(slugs);
  return demoProducts.filter((p) => wanted.has(p.slug));
}

// ── Orders ───────────────────────────────────────────────────────────────────

export type NewOrderItem = {
  productId: string | null;
  productName: string;
  productSlug: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type NewOrder = {
  userId: string | null;
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  items: NewOrderItem[];
};

function makeOrderNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 6; i++) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `VV-${tail}`;
}

export async function createOrder(input: NewOrder) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const orderNumber = makeOrderNumber();
    if (demoOrders.has(orderNumber)) continue;

    const orderId = crypto.randomUUID();
    const order: OrderRow = {
      id: orderId,
      orderNumber,
      userId: input.userId,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      country: input.country,
      notes: input.notes,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      status: "pending",
      createdAt: new Date(),
    };
    const items: OrderItemRow[] = input.items.map((it) => ({
      id: crypto.randomUUID(),
      orderId,
      productId: it.productId,
      productName: it.productName,
      productSlug: it.productSlug,
      image: it.image,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      lineTotal: it.lineTotal,
    }));
    demoOrders.set(orderNumber, { order, items });
    return order;
  }
  throw new Error("Could not allocate an order number");
}

export async function getOrderByNumber(orderNumber: string) {
  return demoOrders.get(orderNumber) ?? null;
}

export async function listOrdersByUser(userId: string) {
  return [...demoOrders.values()]
    .filter(({ order }) => order.userId === userId)
    .sort((a, b) => b.order.createdAt.getTime() - a.order.createdAt.getTime());
}

// ── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  return demoProfiles.get(userId) ?? null;
}

export type ProfileInput = {
  fullName?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
};

export async function upsertProfile(userId: string, input: ProfileInput) {
  const existing = demoProfiles.get(userId);
  const now = new Date();
  const row: ProfileRow = {
    id: existing?.id ?? crypto.randomUUID(),
    userId,
    fullName: input.fullName ?? null,
    phone: input.phone ?? null,
    addressLine1: input.addressLine1 ?? null,
    addressLine2: input.addressLine2 ?? null,
    city: input.city ?? null,
    state: input.state ?? null,
    pincode: input.pincode ?? null,
    country: input.country ?? "India",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  demoProfiles.set(userId, row);
  return row;
}

// ── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string) {
  const normalized = email.toLowerCase();
  const alreadySubscribed = demoNewsletter.has(normalized);
  demoNewsletter.add(normalized);
  return { subscribed: true, alreadySubscribed };
}
