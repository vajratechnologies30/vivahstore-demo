import { beforeEach, describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { makeCaller } from "./_core/test-caller";
import { shippingFor, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING, formatINR } from "../shared/store";

// ── Shipping rule ────────────────────────────────────────────────────────────
// The threshold is the one number a customer can be misled by, so it is pinned
// here rather than left to the UI to get right.
describe("shippingFor", () => {
  it("charges nothing for an empty cart", () => {
    expect(shippingFor(0)).toBe(0);
  });

  it("charges the flat rate below the threshold", () => {
    expect(shippingFor(1)).toBe(FLAT_SHIPPING);
    expect(shippingFor(FREE_SHIPPING_THRESHOLD - 1)).toBe(FLAT_SHIPPING);
  });

  it("is complimentary exactly at the threshold and above", () => {
    expect(shippingFor(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(shippingFor(FREE_SHIPPING_THRESHOLD + 100000)).toBe(0);
  });
});

describe("formatINR", () => {
  it("renders paise as whole rupees with Indian grouping", () => {
    expect(formatINR(0)).toBe("₹0");
    expect(formatINR(449900)).toBe("₹4,499");
    expect(formatINR(1099900)).toBe("₹10,999");
  });
});

// ── Order placement ──────────────────────────────────────────────────────────
// The client sends slugs and quantities only. Prices MUST be re-read from the
// database, or a crafted request could buy a ₹8,999 set for ₹1.
vi.mock("./_core/auth", () => {
  class AuthError extends Error {}
  return {
    authProvider: () => ({ login: vi.fn(), logout: vi.fn(), getSession: vi.fn() }),
    registerLocalUser: vi.fn(),
    AuthError,
    EmailTakenError: class EmailTakenError extends AuthError {},
  };
});

vi.mock("./_core/storage", () => ({
  storageCommit: vi.fn(),
  storageDeleteOwned: vi.fn(),
  storageListByOwner: vi.fn(),
  storagePutUrl: vi.fn(),
  StorageError: class StorageError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
    }
  },
}));

const getProductsBySlugs = vi.fn();
const createOrder = vi.fn();
const listOrdersByUser = vi.fn();
const getOrderByNumber = vi.fn();

vi.mock("./db", () => ({
  listCategories: vi.fn(),
  listProducts: vi.fn(),
  getProductBySlug: vi.fn(),
  listFeatured: vi.fn(),
  listBestsellers: vi.fn(),
  listRelated: vi.fn(),
  getProductsBySlugs: (...a: unknown[]) => getProductsBySlugs(...a),
  createOrder: (...a: unknown[]) => createOrder(...a),
  getOrderByNumber: (...a: unknown[]) => getOrderByNumber(...a),
  listOrdersByUser: (...a: unknown[]) => listOrdersByUser(...a),
  getProfile: vi.fn(),
  upsertProfile: vi.fn(),
  subscribeNewsletter: vi.fn(),
}));

// Importing the router registers the procedures the caller below invokes.
await import("./routers");

// Each test asserts on the FIRST call the router made, so the call history has
// to start empty every time.
beforeEach(() => {
  vi.clearAllMocks();
});

const ADDRESS = {
  customerName: "Ananya Sharma",
  email: "ananya@example.com",
  phone: "+91 98765 43210",
  addressLine1: "12 C-Scheme",
  city: "Jaipur",
  state: "Rajasthan",
  pincode: "302001",
  country: "India",
};

const TURTLE = {
  id: "p1",
  slug: "goodluck-turtle-velvet-box",
  name: "Good Luck Turtle",
  price: 189900,
  images: ["/images/vivah_products_v7.png"],
};

function caller(user: { id: string } | null = null) {
  return makeCaller({ c: {} as never, db: {} as never, user: user as never });
}

describe("orders.place", () => {
  it("prices the order from the database, not from the request", async () => {
    getProductsBySlugs.mockResolvedValueOnce([TURTLE]);
    createOrder.mockImplementationOnce(async (input: { total: number }) => ({
      orderNumber: "VV-TEST01",
      total: input.total,
    }));

    const result = await caller().orders.place({
      ...ADDRESS,
      items: [{ slug: TURTLE.slug, quantity: 2 }],
    });

    expect(result.orderNumber).toBe("VV-TEST01");
    const written = createOrder.mock.calls[0][0];
    expect(written.subtotal).toBe(189900 * 2);
    expect(written.shipping).toBe(0); // 3,798 is above the free-shipping threshold
    expect(written.total).toBe(189900 * 2);
    expect(written.items[0].unitPrice).toBe(189900);
    expect(written.items[0].lineTotal).toBe(189900 * 2);
  });

  it("adds the flat shipping rate below the threshold", async () => {
    const cheap = { ...TURTLE, price: 169900 };
    getProductsBySlugs.mockResolvedValueOnce([cheap]);
    createOrder.mockImplementationOnce(async (input: { total: number }) => ({
      orderNumber: "VV-TEST02",
      total: input.total,
    }));

    await caller().orders.place({ ...ADDRESS, items: [{ slug: cheap.slug, quantity: 1 }] });

    const written = createOrder.mock.calls[0][0];
    expect(written.subtotal).toBe(169900);
    expect(written.shipping).toBe(FLAT_SHIPPING);
    expect(written.total).toBe(169900 + FLAT_SHIPPING);
  });

  it("attaches the order to the signed-in customer", async () => {
    getProductsBySlugs.mockResolvedValueOnce([TURTLE]);
    createOrder.mockImplementationOnce(async () => ({ orderNumber: "VV-TEST03" }));

    await caller({ id: "user-42" }).orders.place({
      ...ADDRESS,
      items: [{ slug: TURTLE.slug, quantity: 1 }],
    });

    expect(createOrder.mock.calls[0][0].userId).toBe("user-42");
  });

  it("leaves userId null for a guest order", async () => {
    getProductsBySlugs.mockResolvedValueOnce([TURTLE]);
    createOrder.mockImplementationOnce(async () => ({ orderNumber: "VV-TEST04" }));

    await caller(null).orders.place({ ...ADDRESS, items: [{ slug: TURTLE.slug, quantity: 1 }] });

    expect(createOrder.mock.calls[0][0].userId).toBeNull();
  });

  it("refuses an order containing a piece that no longer exists", async () => {
    getProductsBySlugs.mockResolvedValueOnce([]);

    const err = await caller()
      .orders.place({ ...ADDRESS, items: [{ slug: "retired-piece", quantity: 1 }] })
      .catch((e) => e);

    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe("BAD_REQUEST");
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("rejects an empty cart before touching the database", async () => {
    const err = await caller()
      .orders.place({ ...ADDRESS, items: [] })
      .catch((e) => e);

    expect(err).toBeInstanceOf(TRPCError);
    expect(getProductsBySlugs).not.toHaveBeenCalled();
  });
});

// ── Order history is owner-scoped ────────────────────────────────────────────
describe("orders.mine", () => {
  it("asks the database only for the signed-in customer's own orders", async () => {
    listOrdersByUser.mockResolvedValueOnce([]);

    await caller({ id: "user-7" }).orders.mine();

    expect(listOrdersByUser).toHaveBeenCalledWith("user-7");
  });

  it("refuses an anonymous caller", async () => {
    const err = await caller(null)
      .orders.mine()
      .catch((e) => e);

    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe("UNAUTHORIZED");
    expect(listOrdersByUser).not.toHaveBeenCalled();
  });
});

// ── Guest order lookup ───────────────────────────────────────────────────────
describe("orders.byNumber", () => {
  it("normalises the order number before looking it up", async () => {
    getOrderByNumber.mockResolvedValueOnce({ order: { orderNumber: "VV-ABC123" }, items: [] });

    await caller().orders.byNumber({ orderNumber: "  vv-abc123  " });

    expect(getOrderByNumber).toHaveBeenCalledWith("VV-ABC123");
  });

  it("reports a missing order as NOT_FOUND", async () => {
    getOrderByNumber.mockResolvedValueOnce(null);

    const err = await caller()
      .orders.byNumber({ orderNumber: "VV-NOPE00" })
      .catch((e) => e);

    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe("NOT_FOUND");
  });
});

// ── Profile is owner-scoped ──────────────────────────────────────────────────
describe("profile", () => {
  it("refuses an anonymous caller", async () => {
    const err = await caller(null)
      .profile.get()
      .catch((e) => e);

    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe("UNAUTHORIZED");
  });
});

// ── Catalogue is public ──────────────────────────────────────────────────────
describe("catalog", () => {
  it("lets an anonymous visitor read the catalogue", async () => {
    await expect(caller(null).catalog.categories()).resolves.not.toThrow();
  });
});
