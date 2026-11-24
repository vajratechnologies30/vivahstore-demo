// tRPC API surface for the demo storefront (no database).
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import * as q from "./db";
import { shippingFor } from "../shared/store";

const ACCOUNTS_DISABLED = "Accounts are disabled in this demo. You can still check out as a guest.";

const authRouter = router({
  me: publicProcedure.query(({ ctx }) => ctx.user),

  signup: publicProcedure
    .input(z.object({ email: z.email(), password: z.string().min(8), name: z.string().optional() }))
    .mutation(() => {
      throw new TRPCError({ code: "FORBIDDEN", message: ACCOUNTS_DISABLED });
    }),

  login: publicProcedure
    .input(z.object({ email: z.email(), password: z.string() }))
    .mutation(() => {
      throw new TRPCError({ code: "FORBIDDEN", message: ACCOUNTS_DISABLED });
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.c?.get?.("logout")?.();
    return { ok: true };
  }),
});

// ── Catalogue (public reads) ─────────────────────────────────────────────────
const catalogRouter = router({
  categories: publicProcedure.query(() => q.listCategories()),

  products: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          sort: z.enum(["featured", "price-asc", "price-desc", "name"]).optional(),
        })
        .optional(),
    )
    .query(({ input }) => q.listProducts({ category: input?.category, sort: input?.sort })),

  featured: publicProcedure.query(() => q.listFeatured(4)),

  bestsellers: publicProcedure.query(() => q.listBestsellers(4)),

  product: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const product = await q.getProductBySlug(input.slug);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "That piece is no longer available." });
      }
      const related = await q.listRelated(product.categorySlug, product.slug, 4);
      return { product, related };
    }),
});

// ── Orders ───────────────────────────────────────────────────────────────────
const orderItemInput = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const addressInput = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().trim().min(6, "Please enter a contact number."),
  addressLine1: z.string().trim().min(3, "Please enter your address."),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Please enter your city."),
  state: z.string().trim().min(1, "Please enter your state."),
  pincode: z.string().trim().min(3, "Please enter your PIN code."),
  country: z.string().trim().min(1).default("India"),
  notes: z.string().trim().max(1000).optional(),
});

const ordersRouter = router({
  // Prices are always re-read from the demo catalogue — the client never
  // decides what something costs.
  place: publicProcedure
    .input(addressInput.extend({ items: z.array(orderItemInput).min(1, "Your cart is empty.") }))
    .mutation(async ({ ctx, input }) => {
      const slugs = [...new Set(input.items.map((i) => i.slug))];
      const rows = await q.getProductsBySlugs(slugs);
      const bySlug = new Map(rows.map((r) => [r.slug, r]));

      const lines = input.items.map((line) => {
        const product = bySlug.get(line.slug);
        if (!product) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One of the pieces in your cart is no longer available. Please review your cart.",
          });
        }
        return {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          image: product.images?.[0] ?? null,
          unitPrice: product.price,
          quantity: line.quantity,
          lineTotal: product.price * line.quantity,
        };
      });

      const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
      const shipping = shippingFor(subtotal);

      const order = await q.createOrder({
        userId: ctx.user?.id ?? null,
        customerName: input.customerName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2 ?? null,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        country: input.country,
        notes: input.notes ?? null,
        subtotal,
        shipping,
        total: subtotal + shipping,
        items: lines,
      });

      return { orderNumber: order.orderNumber };
    }),

  byNumber: publicProcedure
    .input(z.object({ orderNumber: z.string().min(1) }))
    .query(async ({ input }) => {
      const found = await q.getOrderByNumber(input.orderNumber.trim().toUpperCase());
      if (!found) {
        throw new TRPCError({ code: "NOT_FOUND", message: "We could not find that order." });
      }
      return found;
    }),

  mine: protectedProcedure.query(({ ctx }) => q.listOrdersByUser(ctx.user.id)),
});

// ── Account profile (demo: in-memory, no accounts UI flow) ───────────────────
const profileRouter = router({
  get: protectedProcedure.query(({ ctx }) => q.getProfile(ctx.user.id)),
  save: protectedProcedure
    .input(
      z.object({
        fullName: z.string().trim().max(120).optional(),
        phone: z.string().trim().max(40).optional(),
        addressLine1: z.string().trim().max(200).optional(),
        addressLine2: z.string().trim().max(200).optional(),
        city: z.string().trim().max(80).optional(),
        state: z.string().trim().max(80).optional(),
        pincode: z.string().trim().max(20).optional(),
        country: z.string().trim().max(80).optional(),
      }),
    )
    .mutation(({ ctx, input }) => q.upsertProfile(ctx.user.id, input)),
});

// ── Newsletter ───────────────────────────────────────────────────────────────
const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({ email: z.email("Please enter a valid email address.") }))
    .mutation(({ input }) => q.subscribeNewsletter(input.email)),
});

export const appRouter = router({
  auth: authRouter,
  catalog: catalogRouter,
  orders: ordersRouter,
  profile: profileRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
