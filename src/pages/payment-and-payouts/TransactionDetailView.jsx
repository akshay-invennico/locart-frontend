import React from "react";

const InfoItem = ({ label, value, valueClassName = "" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-sm font-medium ${valueClassName}`}>{value || "N/A"}</p>
  </div>
);

const TransactionDetailView = ({ transaction }) => {
  if (!transaction) return <div className="p-4">No transaction data available</div>;

  const formattedDate = (() => {
    try {
      const d = new Date(transaction.date);
      return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return transaction.date || "-";
    }
  })();

  const statusColor =
    transaction.status === "Paid"
      ? "text-[#02C8DE]"
      : transaction.status === "Failed"
        ? "text-red-500"
        : "text-yellow-500";

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
          value={transaction.transactionId || transaction.id}
          valueClassName="text-[#02C8DE]"
        />
        <InfoItem
          label="Client"
          value={transaction.user}
          valueClassName="text-[#02C8DE]"
        />

        <InfoItem
          label="Date & Time"
          value={`${formattedDate}    ${transaction.time || ""}`}
        />
        <InfoItem
          label="Transaction Type"
          value={transaction.type}
        />

        <InfoItem
          label="Booking ID"
          value={transaction.bookingId || "-"}
          valueClassName="text-[#02C8DE]"
        />
        <InfoItem
          label="Payment Method"
          value={transaction.method}
        />

        <InfoItem
          label="Transaction Amount"
          value={`$${Number(transaction.amount || 0).toFixed(2)}`}
        />
        <InfoItem
          label="Status"
          value={transaction.status}
          valueClassName={statusColor}
        />
      </div>
    </div>
  );
};

export default TransactionDetailView;
