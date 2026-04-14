import React, { useState, useEffect } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import ActionComponent from "@/components/grid/actionComponent";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  patchOrderStatus,
  patchFlagOrders,
  fetchOrderById,
} from "@/state/ecom/ecomSlice";
import { exportGridCSV, exportGridPDF, generateInvoicePDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";
import { SlidePanel, ConfirmDialog } from "@/components/feedback";
import OrderFilterForm from "./forms/OrderFilterForm";
import FlagOrderForm from "./forms/FlagOrderForm";
import OrderDetailsView from "./OrderDetailsView";
import Spinner from "@/components/common/Spinner";

const options = {
  select: true,
  order: false,
};

const OrderPage = () => {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selectedFlagOrders, setSelectedFlagOrders] = useState([]);
  const [showFlagPopup, setShowFlagPopup] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailContent, setDetailContent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState({});
  const itemsPerPage = 10;

  const { orders, pagination, loading } = useSelector((state) => state.ecomOrders);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders({
      page: currentPage,
      limit: itemsPerPage,
      orderMode: isToggled ? "store" : "",
    }));
  }, [dispatch, currentPage, isToggled]);

  const handleStatusUpdate = (orderIds, newStatus) => {
    const payload = {
      orderIds,
      status: newStatus,
    };

    dispatch(patchOrderStatus(payload))
      .unwrap()
      .then(() => {
        toast.success(`Order status updated to ${newStatus}.`);
        dispatch(fetchAllOrders());
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update order status.");
      });
  };

  const handleViewOrder = async (orderId) => {
    try {
      const order = await dispatch(fetchOrderById(orderId)).unwrap();

      setDetailContent(
        <OrderDetailsView
          order={order}
          onDownloadInvoice={(orderData) => handleDownloadInvoice({ id: orderData.order_id })}
        />
      );
      setShowDetailPanel(true);
    } catch (e) {
      toast.error("Failed to load order details");
    }
  };

  const formattedOrders = orders?.map((item) => ({
    ...item,
    orderStatus: item.orderStatus?.toLowerCase(),
    paymentStatus: item.paymentStatus?.toLowerCase(),
  }));

  const handleDownloadInvoice = async (row) => {
    try {
      const order = await dispatch(fetchOrderById(row.id)).unwrap();

      if (!order) {
        toast.error("Could not fetch order details.");
        return;
      }

      const products = order.products || [];
      const itemTotal = order.invoice?.itemTotal ?? order.totalAmount ?? 0;
      const taxes = order.invoice?.taxes ?? (Number(itemTotal) * 0.08);
      const loyaltyDiscount = order.invoice?.loyaltyDiscount ?? 0;
      const total = order.invoice?.totalPayable ?? (Number(itemTotal) + Number(taxes) - Number(loyaltyDiscount));

      const shipping = order.shippingDetails || order.shippingAddress || {};
      const addressLine = [
        shipping.address_line_1,
        shipping.address_line_2,
      ].filter(Boolean).join(", ");
      const cityState = [shipping.city, shipping.state, shipping.postal_code].filter(Boolean).join(" ");

      const invoiceData = {
        invoiceNo: order.invoice?.invoiceId || order.order_id || "000",
        issueDate: order.date ? new Date(order.date).toLocaleDateString() : new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        deliveryDate: order.date ? new Date(order.date).toLocaleDateString() : "",
        client: {
          name: order.customerName || order.client?.name || "N/A",
          address: addressLine || "N/A",
          cityState: cityState || "N/A",
          country: shipping.country || "N/A",
        },
        items: products.length > 0
          ? products.map((p) => ({
            description: p.name || p.product?.name || "Product",
            quantity: p.quantity || 1,
            price: p.price ?? p.unitPrice ?? 0,
            discount: p.discount ?? 0,
            amount: p.subtotal ?? ((p.price ?? 0) * (p.quantity ?? 1)),
          }))
          : [
            {
              description: "Order #" + (order.order_id || ""),
              quantity: order.totalItems || 1,
              price: Number(itemTotal),
              discount: Number(loyaltyDiscount),
              amount: Number(itemTotal) - Number(loyaltyDiscount),
            },
          ],
        subtotal: Number(itemTotal).toFixed(2),
        tax: Number(taxes).toFixed(2),
        total: Number(total).toFixed(2),
      };

      generateInvoicePDF(invoiceData);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error("Invoice download failed:", err);
      toast.error("Failed to download invoice.");
    }
  };

  const handleCancelOrder = (row) => {
    setShowCancelPopup(true);
  };

  const handleFlagOrders = (orderIds, reason) => {
    if (!orderIds || orderIds.length === 0) {
      toast.error("No orders selected to flag.");
      return;
    }

    if (!reason) {
      setSelectedFlagOrders(orderIds);
      setShowFlagPopup(true);
      return;
    }

    dispatch(patchFlagOrders({ orderIds, reason }))
      .unwrap()
      .then(() => {
        toast.success("Orders flagged successfully!");
        dispatch(
          fetchAllOrders({
            page: currentPage,
            limit: itemsPerPage,
            orderMode: isToggled ? "store" : "",
          })
        );
        setShowFlagPopup(false);
        setSelectedFlagOrders([]);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          typeof err === "string" ? err : err?.message || "Failed to flag orders!"
        );
      });
  };

  const applyFilters = (values) => {
    setFilterValues(values);

    const filters = {
      orderStatus: values.orderStatus?.includes("All") ? "" : (values.orderStatus || []).join(","),
      paymentStatus: values.paymentStatus?.includes("All") ? "" : (values.paymentStatus || []).join(","),
      dateFrom: values.dateFrom ? new Date(values.dateFrom).toISOString() : "",
      dateTo: values.dateTo ? new Date(values.dateTo).toISOString() : "",
      amountMin: values.amountMin || "",
      amountMax: values.amountMax || "",
      page: 1,
      limit: itemsPerPage,
      orderMode: isToggled ? "store" : "",
    };

    setCurrentPage(1);
    dispatch(fetchAllOrders(filters));
    setShowFilterPanel(false);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    setCurrentPage(1);
    dispatch(fetchAllOrders({ page: 1, limit: itemsPerPage, orderMode: isToggled ? "store" : "" }));
  };

  const columns = getColumns(
    handleCancelOrder,
    handleStatusUpdate,
    handleFlagOrders,
    handleViewOrder,
    handleDownloadInvoice
  );

  const filteredOrders = formattedOrders?.filter((order) => {
    const text = searchText.trim();
    if (!text) return true;
    return (
      order.order_id?.toString().toLowerCase().includes(text) ||
      order.orderStatus?.toLowerCase().includes(text) ||
      order.paymentStatus?.toLowerCase().includes(text) ||
      order.customerName?.toLowerCase().includes(text) ||
      order.totalAmount?.toString()?.includes(text)
    );
  });

  const downloadActions = [
    { header: "Download List" },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridPDF({
          rows: orders,
          columns: columns,
          filename: `orders.pdf`,
          title: "Orders Details",
        });
      },
    },
    {
      label: "Download CSV",
      icon: <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridCSV({
          rows: orders,
          columns: columns,
          filename: `orders.csv`,
        });
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 w-full">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          />
        </div>

        {/* Toggle button */}
        <div className="flex items-center gap-2">
          <span className="text-[#7B7B7B] text-sm font-medium whitespace-nowrap">
            Stores Pickup Orders
          </span>
          <button
            onClick={() => {
              setIsToggled(!isToggled);
              setCurrentPage(1);
            }}
            className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${isToggled
              ? "bg-[#02C8DE] border border-[#02C8DE]"
              : "bg-gray-300 border border-[#7B7B7B]"
              }`}
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isToggled
                ? "translate-x-6 bg-white"
                : "translate-x-0 bg-[#7B7B7B]"
                }`}
            />
          </button>
        </div>

        {/* Buttons container */}
        <div className="flex items-center justify-start lg:justify-end flex-wrap gap-2 w-full lg:w-auto">
          <ActionComponent
            actions={downloadActions}
            buttonClassName="flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          {/* Filter */}
          <button
            onClick={() => setShowFilterPanel(true)}
            className="flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>

          {/* Create order */}
          <button
            onClick={() => navigate("/my-ecom/order/create-in-store-order")}
            className="flex items-center justify-center gap-2 bg-[#02C8DE] text-white p-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          >
            <img
              src="/icons/plusbutton.svg"
              alt="Create Order"
              width={18}
              height={18}
            />
            <span className="hidden sm:inline">Create Order</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        )}
        {!loading && <GridCommonComponent
          data={filteredOrders || []}
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
          pagination={{
            currentPage: pagination?.page || 1,
            totalPages: pagination?.totalPages || 1,
            totalItems: pagination?.total || 0,
            itemsPerPage: pagination?.limit || 10,
            onPageChange: (page) => setCurrentPage(page),
          }}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
          bulkActionsConfig={[
            {
              label: "Mark As Shipped",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (rows) => {
                const orderIds = rows.map((r) => r.order_id);
                handleStatusUpdate(orderIds, "Shipped");
              },
            },
            {
              label: "Mark As Dispatched",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (rows) => {
                const orderIds = rows.map((r) => r.order_id);
                handleStatusUpdate(orderIds, "Dispatched");
              },
            },
            {
              label: "Mark As Delivered",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (rows) => {
                const orderIds = rows.map((r) => r.order_id);
                handleStatusUpdate(orderIds, "Delivered");
              },
            },
            {
              label: "Flag Orders",
              iconUrl: "/icons/flag.svg",
              type: "popUp",
              onClick: (rows) => {
                setSelectedFlagOrders(rows.map((r) => r.order_id));
                setShowFlagPopup(true);
              },
            },
            {
              label: "Export Selection",
              iconUrl: "/icons/download.svg",
              children: [
                { header: "Download List" },
                {
                  label: "Download PDF",
                  icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
                  onClick: (rows) => {
                    if (!rows?.length) {
                      toast.error("No rows selected!");
                      return;
                    }
                    exportGridPDF({
                      rows,
                      columns,
                      filename: `selected-orders.pdf`,
                      title: "Selected Orders",
                    });
                    toast.success("PDF downloaded successfully!");
                  },
                },
                {
                  label: "Download CSV",
                  icon: <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />,
                  onClick: (rows) => {
                    if (!rows?.length) {
                      toast.error("No rows selected!");
                      return;
                    }
                    exportGridCSV({
                      rows,
                      columns,
                      filename: `selected-orders.csv`,
                    });
                    toast.success("CSV downloaded successfully!");
                  },
                },
              ],
            },
          ]}
        />}
      </div>

      {/* Filter Sidebar */}
      <SlidePanel
        open={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        width="sm:max-w-md"
      >
        <OrderFilterForm
          initialValues={filterValues}
          onSubmit={applyFilters}
          onReset={handleResetFilters}
        />
      </SlidePanel>

      {/* Order Detail Sidebar */}
      <SlidePanel
        open={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        width="sm:max-w-[800px]"
      >
        {detailContent}
      </SlidePanel>

      {/* Cancel Order Dialog */}
      <ConfirmDialog
        open={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        title="Cancel Product Order?"
        description="Are you sure you want to cancel this order? This action will notify the Client and initiate a refund process if applicable. Once cancelled, this order cannot be undone."
        confirmLabel="Cancel Order"
        confirmVariant="destructive"
        onConfirm={() => {
          setShowCancelPopup(false);
          setShowRefundPopup(true);
        }}
      />

      {/* Refund Dialog */}
      <ConfirmDialog
        open={showRefundPopup}
        onClose={() => setShowRefundPopup(false)}
        title="Initiate Refund?"
        description="This booking has been cancelled. Please review the payment details below and confirm refund initiation."
        confirmLabel="Confirm Refund"
        cancelLabel="Stay Pending"
        onConfirm={() => setShowRefundPopup(false)}
      />

      {/* Flag Orders Dialog */}
      <ConfirmDialog
        open={showFlagPopup}
        onClose={() => setShowFlagPopup(false)}
        title=""
      >
        <FlagOrderForm
          onSubmit={(values) => {
            handleFlagOrders(selectedFlagOrders, values.reason);
          }}
          onCancel={() => setShowFlagPopup(false)}
        />
      </ConfirmDialog>
    </div>
  );
};

export default OrderPage;
