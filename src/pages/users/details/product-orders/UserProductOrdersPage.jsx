import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { columns } from "./columns";
import { SlidePanel } from "@/components/feedback";
import ProductOrderFilterForm from "./forms/ProductOrderFilterForm";
import { fetchClientOrders } from "@/state/client/clientSlice";
import { fetchOrderById } from "@/state/ecom/ecomSlice";
import { generateInvoicePDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";

export default function UserProductOrdersPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.client);

  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const convertFiltersToParams = (data) => {
    const toIso = (d) => {
      if (!d) return "";
      const dt = d instanceof Date ? d : new Date(d);
      return isNaN(dt.getTime()) ? "" : dt.toISOString();
    };
    return {
      deliveryStatus:
        data?.status?.length && !data.status.includes("all")
          ? data.status.join(",")
          : "",
      dateFrom: toIso(data?.dateFrom),
      dateTo: toIso(data?.dateTo),
      minAmount: data?.minAmount || "",
      maxAmount: data?.maxAmount || "",
      page: 1,
      limit: 10,
    };
  };

  useEffect(() => {
    if (!id) return;
    dispatch(
      fetchClientOrders({
        clientId: id,
        params: convertFiltersToParams(filters),
      })
    );
  }, [id, filters, dispatch]);

  const filteredOrders = useMemo(() => {
    if (!searchText) return orders;
    return orders.filter((order) => {
      const search = searchText.toLowerCase();
      return (
        order.productName?.toLowerCase().includes(search) ||
        order.status?.toLowerCase().includes(search) ||
        order.orderId?.toLowerCase().includes(search)
      );
    });
  }, [orders, searchText]);

  const handleDownloadInvoice = async (row) => {
    try {
      const order = await dispatch(fetchOrderById(row.order_id)).unwrap();
      if (!order) {
        toast.error("Could not fetch order details.");
        return;
      }

      const products = order.products || [];
      const itemTotal =
        order.invoice?.itemTotal ?? order.totalAmount ?? row.amount_paid ?? 0;
      const taxes = order.invoice?.taxes ?? Number(itemTotal) * 0.08;
      const loyaltyDiscount = order.invoice?.loyaltyDiscount ?? 0;
      const total =
        order.invoice?.totalPayable ??
        Number(itemTotal) + Number(taxes) - Number(loyaltyDiscount);

      const shipping = order.shippingDetails || order.shippingAddress || {};
      const addressLine = [shipping.address_line_1, shipping.address_line_2]
        .filter(Boolean)
        .join(", ");
      const cityState = [shipping.city, shipping.state, shipping.postal_code]
        .filter(Boolean)
        .join(" ");

      const invoiceData = {
        invoiceNo: order.invoice?.invoiceId || order.order_id || row.order_id || "000",
        issueDate: order.date
          ? new Date(order.date).toLocaleDateString()
          : row.order_date
            ? new Date(row.order_date).toLocaleDateString()
            : new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        deliveryDate: order.date ? new Date(order.date).toLocaleDateString() : "",
        client: {
          name: order.customerName || order.client?.name || "N/A",
          address: addressLine || "N/A",
          cityState: cityState || "N/A",
          country: shipping.country || "N/A",
        },
        items:
          products.length > 0
            ? products.map((p) => ({
              description: p.name || p.product?.name || "Product",
              quantity: p.quantity || 1,
              price: p.price ?? p.unitPrice ?? 0,
              discount: p.discount ?? 0,
              amount: p.subtotal ?? (p.price ?? 0) * (p.quantity ?? 1),
            }))
            : [
              {
                description:
                  row.product?.name || "Product Order #" + (row.order_id || ""),
                quantity: 1,
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
      toast.error("Failed to download invoice.");
    }
  };

  const applyFilters = (values) => {
    setFilters(values);
    setFilterOpen(false);
  };

  const gridOptions = { select: false, order: false };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative mb-2 w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>
        </div>
      </div>

      <GridCommonComponent
        data={filteredOrders}
        options={gridOptions}
        columns={columns({ handleDownloadInvoice })}
        theme={{
          border: "border-gray-300",
          header: { bg: "bg-gray-100" },
        }}
      />

      <SlidePanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        width="sm:max-w-md"
      >
        <ProductOrderFilterForm
          initialValues={filters}
          onSubmit={applyFilters}
          onReset={() => {
            setFilters({});
            setFilterOpen(false);
          }}
        />
      </SlidePanel>
    </div>
  );
}
