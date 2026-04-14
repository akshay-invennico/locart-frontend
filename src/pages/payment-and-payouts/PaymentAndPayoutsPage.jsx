import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getPaymentColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SlidePanel } from "@/components/feedback";
import TransactionDetailView from "./TransactionDetailView";
import {
  fetchAllTransactions,
  fetchTransactionDetails,
  clearSelectedTransaction,
} from "@/state/payment/paymentSlice";

const options = {
  select: true,
  order: false,
};

const ITEMS_PER_PAGE = 10;

const PaymentAndPayoutsPage = () => {
  const dispatch = useDispatch();
  const {
    transactions,
    detailLoading,
    selectedTransaction,
    transactionPagination,
  } = useSelector((state) => state.payment);

  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchTransactions = useCallback(
    (page = currentPage, searchTerm = search) => {
      dispatch(
        fetchAllTransactions({
          page,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
        })
      );
    },
    [dispatch, currentPage, search]
  );

  useEffect(() => {
    fetchTransactions(currentPage, search);
  }, [currentPage]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setCurrentPage(1);
        fetchTransactions(1, value);
      }, 500)
    );
  };

  const handleViewTransaction = (row) => {
    dispatch(fetchTransactionDetails(row._id));
    setShowDetailPanel(true);
  };

  const columns = getPaymentColumns(handleViewTransaction);

  return (
    <div className="w-full">
      <div className="relative mb-2 w-[400px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search by ID, name, or email..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div>
        <GridCommonComponent
          data={transactions}
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
          pagination={{
            currentPage: transactionPagination.page,
            totalPages: transactionPagination.totalPages,
            totalItems: transactionPagination.total,
            itemsPerPage: ITEMS_PER_PAGE,
            onPageChange: (page) => setCurrentPage(page),
          }}
        />
      </div>

      <SlidePanel
        open={showDetailPanel}
        onClose={() => {
          setShowDetailPanel(false);
          dispatch(clearSelectedTransaction());
        }}
        width="sm:max-w-[480px]"
      >
        <TransactionDetailView
          transaction={selectedTransaction}
          loading={detailLoading}
        />
      </SlidePanel>
    </div>
  );
};

export default PaymentAndPayoutsPage;
