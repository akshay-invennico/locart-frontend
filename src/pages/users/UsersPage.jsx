import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import ActionComponent from "@/components/grid/actionComponent";
import { SlidePanel } from "@/components/feedback";
import { ConfirmDialog } from "@/components/feedback";
import SuspendClientForm from "./forms/SuspendClientForm";
import UserFilterForm from "./forms/UserFilterForm";
import {
  fetchClients,
  setClientFilters,
  suspendClientsByIds,
  reactivateClientById,
} from "@/state/client/clientSlice";
import { sendForgotPassword } from "@/state/auth/authSlice";
import { exportGridPDF, exportGridCSV } from "@/lib/HelpFulFunction";
import { toast } from "sonner";

const options = {
  select: true,
  order: false,
};

const UsersPage = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.client.clients);
  const filters = useSelector((state) => state.client.filters);
  const pagination = useSelector((state) => state.client.pagination);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [bulkSuspendOpen, setBulkSuspendOpen] = useState(false);
  const [bulkSuspendRows, setBulkSuspendRows] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(
      fetchClients({ ...filters, page: currentPage, limit: itemsPerPage })
    );
  }, [currentPage]);

  useEffect(() => {
    dispatch(fetchClients({ ...filters, page: 1, limit: itemsPerPage }));
    setCurrentPage(1);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setCurrentPage(1);
    dispatch(
      fetchClients({ ...filters, search: value, page: 1, limit: itemsPerPage })
    );
  };

  const handleSuspendClients = (formData, rowsOrRow) => {
    const rows = Array.isArray(rowsOrRow) ? rowsOrRow : [rowsOrRow];
    if (!rows.length) return;

    const clientIds = rows.map((row) => row.id || row.clientId || row._id);
    let reason = formData?.suspend_reason || "Repeated policy violations";
    if (formData?.note) reason += ` - ${formData.note}`;

    dispatch(suspendClientsByIds({ clientIds, reason }))
      .unwrap()
      .then(() => {
        dispatch(fetchClients(filters));
        toast.success("Client suspended successfully");
        setBulkSuspendOpen(false);
      })
      .catch((err) => {
        toast.error(err || "Failed to suspend client");
      });
  };

  const handleReactivateClient = (row) => {
    dispatch(reactivateClientById(row.id || row._id))
      .unwrap()
      .then(() => {
        dispatch(fetchClients(filters));
        toast.success("Client reactivated successfully");
      })
      .catch((err) => {
        toast.error(err || "Failed to reactivate client");
      });
  };

  const handleSendResetPasswordLink = (row) => {
    const email = row?.user?.email || row?.email;
    if (!email) return;

    dispatch(sendForgotPassword(email))
      .unwrap()
      .then(() => toast.success("Reset password link sent successfully"))
      .catch(() => toast.error("Failed to send reset password link"));
  };

  const applyFilters = (values) => {
    setFilterValues(values);

    const transformed = {
      status: values.status?.includes("all") ? "" : values.status?.join(",") || "",
      joinedFrom: values.joinedFrom ? new Date(values.joinedFrom).toISOString() : "",
      joinedTo: values.joinedTo ? new Date(values.joinedTo).toISOString() : "",
      minSpent: values.minSpent || "",
      maxSpent: values.maxSpent || "",
      page: 1,
      limit: itemsPerPage,
    };

    setCurrentPage(1);
    dispatch(setClientFilters(transformed));
    dispatch(fetchClients(transformed));
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setFilterValues({});
    dispatch(setClientFilters({}));
    dispatch(fetchClients({ page: 1, limit: itemsPerPage }));
    setFilterOpen(false);
  };

  const downloadActions = [
    { header: "Download List" },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () =>
        exportGridPDF({
          rows: clients,
          columns: columns(null),
          filename: "clients.pdf",
          title: "Clients List",
        }),
    },
    {
      label: "Download CSV",
      icon: <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () =>
        exportGridCSV({
          rows: clients,
          columns: columns(null),
          filename: "clients.csv",
        }),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 w-full placeholder:text-[#D2D4D4]"
            placeholder="Search here..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <ActionComponent
            actions={downloadActions}
            buttonClassName="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          <button
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center justify-center p-2 border border-[#02C8DE] bg-white rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>
        </div>
      </div>

      <GridCommonComponent
        data={clients || []}
        options={options}
        columns={columns(
          handleSendResetPasswordLink,
          handleSuspendClients,
          handleReactivateClient
        )}
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
            label: "Suspend Client",
            iconUrl: "/icons/suspendClient.svg",
            onClick: (rows) => {
              setBulkSuspendRows(rows);
              setBulkSuspendOpen(true);
            },
          },
        ]}
      />

      {/* Filter Sidebar */}
      <SlidePanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        width="sm:max-w-md"
      >
        <UserFilterForm
          initialValues={filterValues}
          onSubmit={applyFilters}
          onReset={resetFilters}
        />
      </SlidePanel>

      {/* Bulk Suspend Dialog */}
      <SlidePanel
        open={bulkSuspendOpen}
        onClose={() => setBulkSuspendOpen(false)}
        width="sm:max-w-md"
      >
        <SuspendClientForm
          bulk
          count={bulkSuspendRows.length}
          onSubmit={(values) => handleSuspendClients(values, bulkSuspendRows)}
          onCancel={() => setBulkSuspendOpen(false)}
        />
      </SlidePanel>
    </div>
  );
};

export default UsersPage;
