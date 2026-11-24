import { Link, useParams } from "wouter";
import { Check } from "lucide-react";
import { trpc } from "@/_core/trpc";
import { useAuth } from "@/_core/useAuth";
import { formatINR, ORDER_STATUS_LABEL } from "@shared/store";

export default function OrderConfirmation() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber ?? "";
  const { user } = useAuth();
  const { data, isLoading, isError } = trpc.orders.byNumber.useQuery(
    { orderNumber },
    { enabled: !!orderNumber },
  );

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <div className="h-8 w-48 animate-pulse bg-bone" />
        <div className="mt-6 h-40 animate-pulse bg-bone" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="eyebrow">Order</p>
        <h1 className="mt-4 font-display text-4xl text-wine">We could not find that order</h1>
        <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
          Check the order number in your confirmation, or write to the studio and we will look it
          up for you.
        </p>
        <Link to="/contact" className="btn-wine mt-8">
          Contact the Studio
        </Link>
      </main>
    );
  }

  const { order, items } = data;

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-bone">
          <Check className="h-6 w-6 text-wine" strokeWidth={1.5} />
        </div>
        <p className="eyebrow mt-7">Order placed</p>
        <h1 className="display-lg mt-4 text-wine">Thank you, {order.customerName.split(" ")[0]}.</h1>
        <p className="mx-auto mt-5 max-w-lg text-[15px] font-light leading-relaxed text-ink/65">
          Your order <span className="text-wine">{order.orderNumber}</span> has been received. The
          studio will confirm payment and dispatch by email or WhatsApp within one working day.
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Keep this order number — it is how you can look the order up again.
        </p>
      </div>

      <div className="mt-14 border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-7 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Order</p>
            <p className="mt-1 font-display text-xl text-wine">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Status</p>
            <p className="mt-1 text-sm text-ink">
              {ORDER_STATUS_LABEL[order.status] ?? order.status}
            </p>
          </div>
        </div>

        <ul className="divide-y divide-border px-7">
          {items.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <div className="h-24 w-20 shrink-0 overflow-hidden bg-bone">
                {item.image && (
                  <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <Link
                  to={`/product/${item.productSlug}`}
                  className="font-display text-lg text-ink hover:text-wine"
                >
                  {item.productName}
                </Link>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Qty {item.quantity} · {formatINR(item.unitPrice)} each
                </p>
              </div>
              <span className="text-sm tabular-nums text-ink">{formatINR(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-3 border-t border-border px-7 py-6 text-sm font-light">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums text-ink">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="tabular-nums text-ink">
              {order.shipping === 0 ? "Complimentary" : formatINR(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-4 text-base">
            <span className="text-ink">Total</span>
            <span className="tabular-nums text-wine">{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 border border-border bg-bone/40 px-7 py-7 sm:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Delivering to</p>
          <p className="mt-3 text-sm font-light leading-relaxed text-ink/75">
            {order.customerName}
            <br />
            {order.addressLine1}
            {order.addressLine2 ? (
              <>
                <br />
                {order.addressLine2}
              </>
            ) : null}
            <br />
            {order.city}, {order.state} {order.pincode}
            <br />
            {order.country}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Contact</p>
          <p className="mt-3 text-sm font-light leading-relaxed text-ink/75">
            {order.email}
            <br />
            {order.phone}
          </p>
          {order.notes && (
            <>
              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-gold">Notes</p>
              <p className="mt-2 text-sm font-light leading-relaxed text-ink/70">{order.notes}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/shop" className="btn-wine">
          Continue Shopping
        </Link>
        {user ? (
          <Link to="/account" className="btn-outline">
            View My Orders
          </Link>
        ) : (
          <Link to="/signup" className="btn-outline">
            Create an Account
          </Link>
        )}
      </div>
    </main>
  );
}
