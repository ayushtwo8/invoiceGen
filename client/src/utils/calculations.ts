import type { InvoiceItem } from "../types";

export const calculateItemAmount = (
  quantity: number,
  rate: number,
  tax: number
): number => {
  const subtotal = quantity * rate;
  const taxAmount = (subtotal * tax) / 100;
  return subtotal + taxAmount;
};

export const calculateInvoiceTotals = (
  items: InvoiceItem[],
  discount: number,
  discountType: "percentage" | "fixed"
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const taxAmount = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.rate;
    return sum + (itemSubtotal * item.tax) / 100;
  }, 0);

  let discountAmount = 0;
  if (discountType === "percentage") {
    discountAmount = (subtotal * discount) / 100;
  } else {
    discountAmount = discount;
  }

  const total = subtotal + taxAmount - discountAmount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

export const generateInvoiceNumber = (): string => {
  const prefix = "INV";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};
