import React, { useState } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { PaymentData } from "./data";
import { getPaymentColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SlidePanel } from "@/components/feedback";
import TransactionDetailView from "./TransactionDetailView";

const options = {
  select: true,
  order: false,
};

const PaymentAndPayoutsPage = () => {
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleViewTransaction = (row) => {
    setSelectedTransaction(row);
    setShowDetailPanel(true);
  };

  const columns = getPaymentColumns(handleViewTransaction);

  return (
    <div className="w-full">
      <div className="relative mb-2 w-[400px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input className="pl-10" placeholder="Search here..." />
      </div>
      <div>
        <GridCommonComponent
          data={PaymentData}
          options={options}
          columns={columns?.map((col) => {
            if (col.key === "actions") {
              return {
                ...col,
                component: {
                  ...col.component,
                  options: {
                    ...col.component.options,
                    actions: (row) => col.component.options.actions(row),
                  },
                },
              };
            }
            return col;
          })}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
        />
      </div>

      <SlidePanel
        open={showDetailPanel}
        onClose={() => {
          setShowDetailPanel(false);
          setSelectedTransaction(null);
        }}
        width="sm:max-w-[480px]"
      >
        <TransactionDetailView transaction={selectedTransaction} />
      </SlidePanel>
    </div>
  );
};

export default PaymentAndPayoutsPage;
