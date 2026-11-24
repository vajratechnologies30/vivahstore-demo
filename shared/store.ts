// Shared store rules — used by both the server (authoritative totals) and the
// client (cart preview). Money is stored in paise (integer) everywhere.

export const FREE_SHIPPING_THRESHOLD = 299900; // ₹2,999
export const FLAT_SHIPPING = 14900; // ₹149

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
}

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return "₹" + rupees.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
