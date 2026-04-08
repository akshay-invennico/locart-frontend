import React from "react";
import { Download } from "lucide-react";

const InfoItem = ({ label, value, valueClassName = "" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${valueClassName}`}>{value || "-"}</p>
  </div>
);

const OrderDetailsView = ({ order, onDownloadInvoice }) => {
  if (!order) return <div className="p-4">No order data available</div>;

  const shipping = order.shippingDetails || order.shippingAddress || {};

  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const fmt = (v) => `$${num(v).toFixed(2)}`;

  const productsList = Array.isArray(order.products) ? order.products : [];
  const computedItemTotal = productsList.reduce(
    (sum, p) =>
      sum + num(p.subtotal ?? num(p.price ?? p.unitPrice) * num(p.quantity ?? 1)),
    0
  );

  const itemTotal = num(order.invoice?.itemTotal ?? order.totalAmount ?? computedItemTotal);
  const taxes = num(order.invoice?.taxes);
  const loyaltyDiscount = num(order.invoice?.loyaltyDiscount);
  const totalPayable = num(
    order.invoice?.totalPayable ?? itemTotal + taxes - loyaltyDiscount
  );

  return (
    <div className="space-y-8 flex flex-col pt-3 pb-8 px-2">
      <div>
        <h3 className="text-lg font-bold mb-1">Order Details</h3>
        <p className="text-sm text-gray-500">
          View complete information about this order, including items, delivery, and payment summary.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-800">Order Summary</h4>
        <div className="grid grid-cols-3 gap-y-6 gap-x-4">
          <InfoItem label="Order ID" value={order.order_id} valueClassName="text-[#02C8DE]" />
          <InfoItem label="Total Amount" value={fmt(totalPayable)} />
          <InfoItem label="Transaction ID" value={order.transactionId || "-"} />
          <InfoItem label="Date" value={order.date ? new Date(order.date).toLocaleString() : "-"} />
          <InfoItem label="Payment Method" value={order.paymentMethod || "-"} />
          <InfoItem label="Status" value={order.status} valueClassName="text-[#02C8DE]" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-800">Products Ordered</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productsList.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
                    No products in this order.
                  </td>
                </tr>
              )}
              {productsList.map((p, idx) => {
                const qty = num(p.quantity ?? 1);
                const price = num(p.price ?? p.unitPrice);
                const sub = num(p.subtotal ?? price * qty);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{p.name || p.product?.name || "Product"}</td>
                    <td className="px-4 py-3 text-gray-600">{qty}</td>
                    <td className="px-4 py-3 text-gray-600">{fmt(price)}</td>
                    <td className="px-4 py-3 text-gray-800 text-right">{fmt(sub)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold border-t border-gray-200">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right">Total</td>
                <td className="px-4 py-3 text-right">{fmt(itemTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-800">Shipping Details</h4>
        <div className="grid grid-cols-3 gap-y-6 gap-x-4">
          <InfoItem label="Address Line 1" value={shipping.address_line_1 || "-"} />
          <InfoItem label="Address Line 2" value={shipping.address_line_2 || "-"} />
          <InfoItem label="City" value={shipping.city || "-"} />
          <InfoItem label="State" value={shipping.state || "-"} />
          <InfoItem label="Country" value={shipping.country || "-"} />
          <InfoItem label="Postal Code" value={shipping.postal_code || "-"} />
          <InfoItem label="Phone Number" value={shipping.phone_number || "-"} />
        </div>
      </div>

      <div className="space-y-4 border rounded-md p-4 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
          <h4 className="text-base font-semibold text-gray-800">Invoice Details</h4>
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-xs text-gray-500 font-medium bg-gray-200 px-2 py-1 rounded max-w-[180px]">
              {order.invoice?.invoiceId || order.order_id}
            </span>
            {onDownloadInvoice && (
              <button
                type="button"
                onClick={() => onDownloadInvoice(order)}
                className="shrink-0 inline-flex items-center gap-1 text-[#02C8DE] border border-[#02C8DE] hover:bg-[#02C8DE]/10 px-2 py-1 rounded-md transition-colors text-xs"
                title="Download Invoice"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 mt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Item Total</span>
            <span className="font-medium text-gray-800">{fmt(itemTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Taxes</span>
            <span className="font-medium text-gray-800">{fmt(taxes)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Loyalty Points Discount</span>
            <span className="font-medium text-red-500">-{fmt(loyaltyDiscount)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 mt-2">
            <span className="text-gray-900">Total Payable Amount</span>
            <span className="text-gray-900">{fmt(totalPayable)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsView;
