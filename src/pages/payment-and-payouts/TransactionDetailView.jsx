import React from "react";

const InfoItem = ({ label, value, valueClassName = "" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-sm font-medium ${valueClassName}`}>{value || "N/A"}</p>
  </div>
);

const TransactionDetailView = ({ transaction, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02C8DE]" />
      </div>
    );
  }

  if (!transaction) return <div className="p-4">No transaction data available</div>;

  const formattedDate = (() => {
    try {
      const d = new Date(transaction.created_at);
      return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return "-";
    }
  })();

  const formattedTime = (() => {
    try {
      const d = new Date(transaction.created_at);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch {
      return "";
    }
  })();

  const statusColor =
    transaction.transaction_status === "paid" || transaction.transaction_status === "completed"
      ? "text-green-600"
      : transaction.transaction_status === "failed"
        ? "text-red-500"
        : transaction.transaction_status === "refunded"
          ? "text-gray-500"
          : "text-yellow-500";

  const transactionId = transaction.transaction_id
    ? `#TRN${transaction.transaction_id}`
    : `#${transaction._id?.slice(-8) || "N/A"}`;

  return (
    <div className="flex flex-col pt-3 pb-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Transaction Detail</h3>
        <p className="text-sm text-gray-500">
          Explore detailed information regarding this transaction.
        </p>
        <hr className="mt-3 border-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <InfoItem
          label="Transaction ID"
          value={transactionId}
          valueClassName="text-[#02C8DE]"
        />
        <InfoItem
          label="Client"
          value={transaction.user?.name}
          valueClassName="text-[#02C8DE]"
        />

        <InfoItem
          label="Date & Time"
          value={`${formattedDate}    ${formattedTime}`}
        />
        <InfoItem
          label="Transaction Type"
          value={transaction.type_label || transaction.transaction_type}
        />

        <InfoItem
          label="Booking / Order"
          value={
            transaction.booking?.booking_number ||
            transaction.order?.order_number ||
            "-"
          }
          valueClassName="text-[#02C8DE]"
        />
        <InfoItem
          label="Payment Method"
          value={"Stripe"}
        />

        <InfoItem
          label="Transaction Amount"
          value={`$${Number(transaction.amount || 0).toFixed(2)}`}
        />
        <InfoItem
          label="Status"
          value={transaction.transaction_status || transaction.payment_status}
          valueClassName={statusColor}
        />

        {transaction.subtotal !== undefined && (
          <InfoItem
            label="Subtotal"
            value={`$${Number(transaction.subtotal || 0).toFixed(2)}`}
          />
        )}
        {transaction.tax !== undefined && (
          <InfoItem
            label="Tax"
            value={`$${Number(transaction.tax || 0).toFixed(2)}`}
          />
        )}
        {transaction.discount !== undefined && (
          <InfoItem
            label="Discount"
            value={`-$${Number(transaction.discount || 0).toFixed(2)}`}
            valueClassName="text-red-500"
          />
        )}
        {transaction.net_amount !== undefined && (
          <InfoItem
            label="Net Amount"
            value={`$${Number(transaction.net_amount || 0).toFixed(2)}`}
            valueClassName="text-green-600"
          />
        )}

        {transaction.user?.email && (
          <InfoItem label="Email" value={transaction.user.email} />
        )}
        {transaction.currency && (
          <InfoItem label="Currency" value={transaction.currency.toUpperCase()} />
        )}
      </div>
    </div>
  );
};

export default TransactionDetailView;
