"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { columns } from "./column";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/registry";
import PopupForm from "@/components/ui/popupform";
import { suspendClientConfigAll } from "./config";
import {
  fetchClients,
  setClientFilters,
  suspendClientsByIds,
} from "@/state/client/clientSlice";
import { sendForgotPassword } from "@/state/auth/authSlice";
import { exportGridPDF, exportGridCSV } from "@/lib/HelpFulFunction";
import { toast } from "sonner";

const filterConfig = {
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
      label: "Status",
      options: [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "suspend", label: "Suspended" },
      ],
    },
    {
      type: "checkboxGroup",
      name: "clientType",
      label: "Client Type",
      options: [
        { value: "all", label: "All" },
        { value: "client", label: "Client" },
        { value: "customer", label: "Customer" },
      ],
    },
    { type: "dateRange", name: "joinedDate", label: "Join Date" },
    { type: "numberRange", name: "spendAmount", label: "Spent Amount" },
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
      onClick: (data) => console.log("Applied Filters", data),
    },
  },
};

const options = {
  select: true,
  order: false,
};

const Page = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.client.clients);
  const filters = useSelector((state) => state.client.filters);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchClients(filters));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchClients({ ...filters, search: value }));
  };

  const handleSuspendClients = (formData, rowsOrRow) => {
    // Normalize to array
    const rows = Array.isArray(rowsOrRow) ? rowsOrRow : [rowsOrRow];

    if (!rows.length) {
      return console.error("No clients selected");
    }

    const clientIds = rows.map((row) => row.id || row.clientId);

    dispatch(
      suspendClientsByIds({
        clientIds,
        reason: formData?.reason || "Repeated policy violations",
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchClients(filters));
      })
      .catch((err) => console.error("Suspend failed:", err));
  };

  const handleSendResetPasswordLink = (row) => {
    const email = row?.user?.email || row?.email;

    if (!email) {
      console.error("Email not found for this client");
      return;
    }

    dispatch(sendForgotPassword(email))
      .unwrap()
      .then(() => {
        toast.success("Reset password link sent successfully");
      })
      .catch((err) => {
        console.error("Failed to send reset password link:", err);
        toast.error("Failed to send reset password link");
      });
  };

  const applyFilters = (data) => {
    const getCheckboxValues = (prefix) => {
      return Object.keys(data)
        .filter((k) => k.startsWith(`${prefix}_`) && data[k])
        .map((k) => k.replace(`${prefix}_`, ""));
    };

    const statusObj = getCheckboxValues("status");
    const clientTypeObj = getCheckboxValues("clientType");

    const transformed = {
      status: statusObj.includes("all") ? "" : statusObj.join(","),
      clientType: clientTypeObj.includes("all") ? "" : clientTypeObj.join(","),
      joinedFrom: data?.joinedDate_from ? new Date(data.joinedDate_from).toISOString() : "",
      joinedTo: data?.joinedDate_to ? new Date(data.joinedDate_to).toISOString() : "",
      minSpent: data?.spendAmount_from || "",
      maxSpent: data?.spendAmount_to || "",
    };

    dispatch(setClientFilters(transformed));
    dispatch(fetchClients(transformed));
  };

  const downloadActions = [
    {
      header: "Download List",
    },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () =>
        exportGridPDF({
          rows: clients,
          columns: columns,
          filename: "clients.pdf",
          title: "Clients List",
        }),
    },
    {
      label: "Download CSV",
      icon: <BsFileSpreadsheet className="w-4 h-4  text-[#7B7B7B]" />,
      onClick: () =>
        exportGridCSV({
          rows: clients,
          columns: columns,
          filename: "clients.csv",
        }),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        {/* Search box with fixed width */}
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 w-full placeholder:text-[#D2D4D4]"
            placeholder="Search here..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        {/* Buttons aligned to the right */}
        <div className="flex gap-2">
          <ActionComponent
            actions={downloadActions}
            buttonClassName="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          {/* Filter button*/}
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={{
                      ...filterConfig,
                      footer: {
                        ...filterConfig.footer,
                        apply: {
                          ...filterConfig.footer.apply,
                          onClick: applyFilters,
                        },
                      },
                    }}
                  />
                ),
              },
            ]}
            icon={<Filter className="w-4 h-4 text-[#02C8DE]" />}
            buttonClassName="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md hover:bg-gray-50"
          />
        </div>
      </div>

      <div className="">
        <GridCommonComponent
          data={clients || []}
          options={options}
          columns={columns(handleSendResetPasswordLink)}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
          bulkActionsConfig={[
            {
              label: "Suspend Client",
              iconUrl: "/icons/suspendClient.svg",
              component: (
                <PopupForm
                  config={suspendClientConfigAll}
                  width="500px"
                  onApply={(data, rows) => handleSuspendClients(data, rows)}
                  onCancel={() => console.log("Cancelled")}
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
                  onClick: (selectedRows) => {
                    exportGridPDF({
                      rows: selectedRows,
                      columns: columns,
                      filename: "selected_clients.pdf",
                      title: "Selected Clients",
                    });
                  },
                },
                {
                  label: "Download CSV",
                  icon: (
                    <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />
                  ),
                  onClick: (selectedRows) => {
                    exportGridCSV({
                      rows: selectedRows,
                      columns: columns,
                      filename: "selected_clients.csv",
                    });
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};
export default Page;