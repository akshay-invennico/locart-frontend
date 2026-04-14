import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getRefundColumns } from "./refundColumns";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import { SlidePanel } from "@/components/feedback";
import TransactionDetailView from "./TransactionDetailView";
import ActionComponent from "@/components/grid/actionComponent";
import {
  fetchAllRefunds,
  fetchTransactionDetails,
  clearSelectedTransaction,
} from "@/state/payment/paymentSlice";

const options = {
  select: true,
  order: false,
};

const ITEMS_PER_PAGE = 10;

const RefundsPage = () => {
  const dispatch = useDispatch();
  const { refunds, detailLoading, selectedTransaction, refundPagination } =
    useSelector((state) => state.payment);

  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchRefunds = useCallback(
    (page = currentPage, searchTerm = search) => {
      dispatch(
        fetchAllRefunds({
          page,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
        })
      );
    },
    [dispatch, currentPage, search]
  );

  useEffect(() => {
    fetchRefunds(currentPage, search);
  }, [currentPage]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setCurrentPage(1);
        fetchRefunds(1, value);
      }, 500)
    );
  };

  const handleViewRefund = (row) => {
    dispatch(fetchTransactionDetails(row._id));
    setShowDetailPanel(true);
  };

  const columns = getRefundColumns(handleViewRefund);

  const downloadActions = [
    { header: "Download List" },
    {
      label: "Download PDF",
      icon: <Download className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => { },
    },
    {
      label: "Download CSV",
      icon: <Download className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => { },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2">
          <ActionComponent
            actions={downloadActions}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          <button className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50">
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>
        </div>
      </div>

      <div>
        <GridCommonComponent
          data={refunds}
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
            currentPage: refundPagination.page,
            totalPages: refundPagination.totalPages,
            totalItems: refundPagination.total,
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

export default RefundsPage;
