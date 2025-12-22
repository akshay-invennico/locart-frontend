"use client";
import React, { useState } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getColumns } from "./column";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import Image from "next/image";
import {
  cancelOrderConfig,
  flagOrderConfig,
  orderFilterConfig,
  refundDetailsConfig,
  orderDetailsConfig,
} from "./config";
import PopupForm from "@/components/ui/popupform";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  patchOrderStatus,
  patchFlagOrders,
  fetchOrderById,
} from "@/state/ecom/ecomSlice";
import { useEffect } from "react";
import DetailView from "@/components/modules/DetailView";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";

const options = {
  select: true,
  order: false,
};

const OrderPage = () => {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selectedFlagOrders, setSelectedFlagOrders] = useState([]);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [showFlagPopup, setShowFlagPopup] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [sidebarContent, setSidebarContent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { orders } = useSelector(
    (state) => state.ecomOrders
  );

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

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
    const order = await dispatch(fetchOrderById(orderId)).unwrap();

    setSidebarContent(
      <DetailView
        config={{
          ...orderDetailsConfig,
          fields: orderDetailsConfig.fields.map((field) => {
            if (field.name === "order_summary") {
              return {
                ...field,
                items: [
                  {
                    label: "Order ID",
                    value: order.order_id,
                    valueStyle: { color: "#02C8DE" },
                  },
                  { label: "Total Amount", value: `$${order.totalAmount}` },
                  {
                    label: "Transaction ID",
                    value: order.transactionId || "-",
                  },
                  {
                    label: "Date",
                    value: new Date(order.date).toLocaleString(),
                  },
                  {
                    label: "Payment Method",
                    value: order.paymentMethod || "-",
                  },
                  {
                    label: "Status",
                    value: order.status,
                    valueStyle: { color: "#02C8DE" },
                  },
                ],
              };
            }
            if (field.name === "products") {
              return {
                ...field,
                rows: order.products || [],
                total: `$${order.totalAmount}`,
              };
            }
            if (field.name === "shipping_details") {
              const shipping =
                order.shippingDetails || order.shippingAddress || {};
              return {
                ...field,
                items: [
                  {
                    label: "Address Line 1",
                    value: shipping.address_line_1 || "-",
                  },
                  {
                    label: "Address Line 2",
                    value: shipping.address_line_2 || "-",
                  },
                  { label: "City", value: shipping.city || "-" },
                  { label: "State", value: shipping.state || "-" },
                  { label: "Country", value: shipping.country || "-" },
                  { label: "Postal Code", value: shipping.postal_code || "-" },
                  {
                    label: "Phone Number",
                    value: shipping.phone_number || "-",
                  },
                ],
              };
            }
            if (field.name === "invoice") {
              const invoice = order.invoice || {};

              return {
                ...field,
                items: [
                  { label: "Invoice ID", value: invoice.invoiceId || "-" },
                  { label: "Item Total", value: invoice.itemTotal ?? "-" },
                  { label: "Taxes", value: invoice.taxes ?? "-" },
                  {
                    label: "Loyalty Points Discount",
                    value: invoice.loyaltyDiscount ?? "-",
                  },
                  {
                    label: "Total Payable Amount",
                    value: invoice.totalPayable ?? "-",
                  },
                ],
              };
            }
            return field;
          }),
        }}
        width="800px"
        onCancel={() => setSidebarContent(null)}
      />
    );
  };

  const formattedOrders = orders?.map((item) => ({
    ...item,
    orderStatus: item.orderStatus?.toLowerCase(),
    paymentStatus: item.paymentStatus?.toLowerCase(),
  }));

  const handleCancelOrder = (row) => {
    setSelectedOrder(row);
    setShowCancelPopup(true);
  };

  const handleFlagOrders = (orderIds, reason) => {
    dispatch(patchFlagOrders({ orderIds, reason }))
      .unwrap()
      .then(() => {
        toast.success("Orders flagged successfully!");
        dispatch(fetchAllOrders());
        setShowFlagPopup(false);
        setFlagReason("");
        setSelectedFlagOrders([]);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to flag orders!" || err);
      });
  };

  const applyFilters = (data) => {
    const getCheckboxValues = (prefix) => {
      return Object.keys(data)
        .filter((k) => k.startsWith(`${prefix}_`) && data[k])
        .map((k) => k.replace(`${prefix}_`, ""));
    };

    const statusObj = getCheckboxValues("status");
    const paymentStatusObj = getCheckboxValues("clientType"); // 'clientType' is the name for Payment Status in config

    const filters = {
      orderStatus: statusObj.includes("All") ? "" : statusObj.join(","),
      paymentStatus: paymentStatusObj.includes("All")
        ? ""
        : paymentStatusObj.join(","),
      dateFrom: data.DateRange_from
        ? new Date(data.DateRange_from).toISOString()
        : "",
      dateTo: data.DateRange_to
        ? new Date(data.DateRange_to).toISOString()
        : "",
      amountMin: data.AmountRange_from || "",
      amountMax: data.AmountRange_to || "",
    };

    dispatch(fetchAllOrders(filters));
  };

  const columns = getColumns(
    handleCancelOrder,
    handleStatusUpdate,
    handleFlagOrders,
    handleViewOrder
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
    {
      header: "Download List",
    },
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
      icon: <BsFileSpreadsheet className="w-4 h-4  text-[#7B7B7B]" />,
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
            onClick={() => setIsToggled(!isToggled)}
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
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={{
                      ...orderFilterConfig,
                      footer: {
                        ...orderFilterConfig.footer,
                        apply: {
                          ...orderFilterConfig.footer.apply,
                          onClick: applyFilters,
                        },
                      },
                    }}
                  />
                ),
              },
            ]}
            icon={<Filter className="w-4 h-4 text-[#02C8DE]" />}
            buttonClassName="flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          />

          {/* Create order */}
          <button
            onClick={() => router.push("/my-ecom/order/create-in-store-order")}
            className="flex items-center justify-center gap-2 bg-[#02C8DE] text-white p-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          >
            <Image
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
        <GridCommonComponent
          data={filteredOrders || []}
          options={options}
          // columns={columns}
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
              component: showFlagPopup && (
                <PopupForm
                  config={flagOrderConfig}
                  width="500px"
                  onApply={(data) =>
                    handleFlagOrders(selectedFlagOrders, data.reason)
                  }
                  onCancel={() => setShowFlagPopup(false)}
                />
              ),
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
                  icon: (
                    <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />
                  ),
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
        />
      </div>

      {showCancelPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 shadow-md rounded-md"
          onClick={() => setShowCancelPopup(false)} // click outside closes
        >
          <div onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* prevent closing when clicking inside */}
            <PopupForm
              config={cancelOrderConfig}
              width="600px"
              onApply={(data) => {
                setShowCancelPopup(false);
                setShowRefundPopup(true);
              }}
              onCancel={() => setShowCancelPopup(false)}
            />
          </div>
        </div>
      )}

      {showRefundPopup && (
        <div
          className="fixed inset-0 z-50 flex  bg-black/50"
          onClick={() => setShowRefundPopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: popupPos.top,
              left: popupPos.left,
            }}
          >
            <PopupForm
              config={refundDetailsConfig}
              width="600px"
              onApply={(data) => {
                setShowRefundPopup(false);
              }}
              onCancel={() => setShowRefundPopup(false)}
            />
          </div>
        </div>
      )}

      {sidebarContent && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30"
          onClick={() => setSidebarContent(null)}
        >
          <div
            className="h-full w-[800px] bg-white shadow-lg overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSidebarContent(null)}
            >
              ✕
            </button>

            {sidebarContent}
          </div>
        </div>
      )}
    </div>
  );
};
export default OrderPage;
