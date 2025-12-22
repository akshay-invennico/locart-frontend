"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { columns } from "../column";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/registry";
import { fetchClientOrders } from "@/state/client/clientSlice";

export default function Page() {
  const options = { select: false, order: false };
  const { id } = useParams();

  const dispatch = useDispatch();

  const { orders = [], loading } = useSelector((state) => state.client);

  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");

  const clientId = id;

  const convertFiltersToParams = (data) => {
    return {
      deliveryStatus:
        data?.status?.length && !data.status.includes("all")
          ? data.status.join(",")
          : "",

      dateFrom: data?.DateRange?.from || "",
      dateTo: data?.DateRange?.to || "",

      minAmount: data?.AmountRange?.min || "",
      maxAmount: data?.AmountRange?.max || "",

      page: 1,
      limit: 10,
    };
  };

  useEffect(() => {
    dispatch(
      fetchClientOrders({ clientId, params: convertFiltersToParams(filters) })
    );
  }, [filters]);

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

  const productConfig = {
    formCss: {
      maxWidth: "500px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    fields: [
      { type: "header", label: "Advanced Filters" },
      {
        type: "subheader",
        text: "Refine your search results using custom criteria across modules.",
      },
      { type: "divider" },
      { type: "filterBy", text: "Filter By:" },

      {
        type: "checkboxGroup",
        name: "status",
        label: "Delivery Status",
        options: [
          { value: "all", label: "All" },
          { value: "shipped", label: "Shipped" },
          { value: "pending", label: "Pending" },
          { value: "delivered", label: "Delivered" },
          { value: "returned", label: "returned" },
          { value: "cancelled", label: "Cancelled" },
        ],
      },
      { type: "dateRange", name: "DateRange", label: "Date Range" },
      { type: "numberRange", name: "AmountRange", label: "Amount Range" },

      {
        type: "selectCheckbox",
        name: "product",
        label: "Product Type",
        options: [
          { value: "AloeLockingGel ", label: "Aloe Locking Gel " },
          { value: "HoneyNourishingBalm", label: "Honey Nourishing Balm" },
          { value: "AloeLockingGel", label: "Aloe Locking Gel" },
          { value: "GreenTeaInfusionCream", label: "Green Tea Infusion Cream" },
          { value: "LocStyling", label: "Loc Styling" },
          { value: "RosehipSerum", label: "Rosehip Serum" },
          {
            value: "PapayaExfoliatingScrub",
            label: "Papaya Exfoliating Scrub",
          },
          { value: "WitchHazelToner", label: "Witch Hazel Toner" },
        ],
      },
    ],
    footer: {
      cancel: {
        label: "Cancel",
        className:
          "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
        onClick: () => console.log("Cancelled"),
      },
      apply: {
        label: "Apply Filters",
        className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
        onClick: (data) => setFilters(data),
      },
    },
  };

  return (
    <div className="w-full">
      {/* Top Controls */}
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
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: <DynamicForm config={productConfig} />,
              },
            ]}
            icon={<Filter className="w-4 h-4 text-[#02C8DE]" />}
            buttonClassName="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          />
        </div>
      </div>

      <GridCommonComponent
        data={filteredOrders}
        options={options}
        columns={columns}
        theme={{
          border: "border-gray-300",
          header: { bg: "bg-gray-100" },
        }}
      />
    </div>
  );
}
