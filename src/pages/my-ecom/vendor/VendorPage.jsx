import React, { useState, useEffect } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { getColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";
import ActionComponent from "@/components/grid/actionComponent";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import {
  fetchAllVendors,
  fetchVendorById,
  createVendor,
  updateVendor,
  deleteVendorAction,
  toggleVendorStatus,
} from "@/state/ecom/ecomSlice";
import { useDispatch, useSelector } from "react-redux";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";
import { toast } from "sonner";
import { SlidePanel, ConfirmDialog } from "@/components/feedback";
import VendorFilterForm from "./forms/VendorFilterForm";
import CreateVendorForm from "./forms/CreateVendorForm";
import EditVendorForm from "./forms/EditVendorForm";
import VendorDetailsView from "./VendorDetailsView";
import Spinner from "@/components/common/Spinner";

const options = {
  select: true,
  order: false,
};

const VendorPage = () => {
  const [deletePopup, setDeletePopup] = useState({ show: false, row: null });
  const [bulkDeletePopup, setBulkDeletePopup] = useState({ show: false, rows: [] });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailContent, setDetailContent] = useState(null);
  const [editVendor, setEditVendor] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const dispatch = useDispatch();
  const { vendors, vendorLoading } = useSelector((state) => state.ecomOrders);

  useEffect(() => {
    dispatch(fetchAllVendors(filters));
  }, [filters.status]);

  // Client-side search filtering
  const filteredVendors = filters.search
    ? vendors.filter((v) => {
        const q = filters.search.toLowerCase();
        return (
          (v.name || "").toLowerCase().includes(q) ||
          (v.email || "").toLowerCase().includes(q) ||
          (v.company || "").toLowerCase().includes(q) ||
          (v.phone || "").includes(q)
        );
      })
    : vendors;

  const handleDeleteVendor = (row) => {
    setDeletePopup({ show: true, row });
  };

  const confirmDeleteVendor = () => {
    if (!deletePopup.row) return;
    dispatch(deleteVendorAction(deletePopup.row._id))
      .unwrap()
      .then(() => {
        toast.success(`${deletePopup.row.name} deleted successfully.`);
        setDeletePopup({ show: false, row: null });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete vendor.");
      });
  };

  const handleViewVendor = async (id) => {
    try {
      const result = await dispatch(fetchVendorById(id)).unwrap();
      setDetailContent(<VendorDetailsView vendor={result} />);
      setShowDetailPanel(true);
    } catch (e) {
      toast.error("Failed to load vendor details");
    }
  };

  const handleVendorStatusUpdate = (vendorId) => {
    dispatch(toggleVendorStatus(vendorId))
      .unwrap()
      .then((updated) => {
        toast.success(`Vendor ${updated.isActive ? "activated" : "deactivated"} successfully.`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update vendor status.");
      });
  };

  const handleCreateVendor = async (data, { resetForm }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (data.company) formData.append("company", data.company);
    if (data.address) formData.append("address", data.address);
    if (data.notes) formData.append("notes", data.notes);
    if (data.profile) {
      const file = Array.isArray(data.profile) ? data.profile[0] : data.profile;
      if (file instanceof File) {
        formData.append("profile", file);
      }
    }

    const res = await dispatch(createVendor(formData));
    if (createVendor.fulfilled.match(res)) {
      toast.success("Vendor created successfully");
      resetForm();
      setShowCreatePanel(false);
    } else {
      toast.error(res.payload?.message || "Failed to create vendor");
    }
  };

  const handleEditVendorOpen = async (id) => {
    try {
      const vendor = await dispatch(fetchVendorById(id)).unwrap();
      setEditVendor(vendor);
      setShowEditPanel(true);
    } catch (error) {
      toast.error("Failed to load vendor details");
    }
  };

  const handleUpdateVendorSubmit = async (data, originalVendor) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (data.company) formData.append("company", data.company);
    if (data.address) formData.append("address", data.address);
    if (data.notes) formData.append("notes", data.notes);
    if (data.profile) {
      const file = Array.isArray(data.profile) ? data.profile[0] : data.profile;
      if (file instanceof File) {
        formData.append("profile", file);
      }
    }

    try {
      await dispatch(
        updateVendor({ vendorId: originalVendor._id, formData })
      ).unwrap();
      toast.success("Vendor updated successfully");
      setShowEditPanel(false);
      setEditVendor(null);
      dispatch(fetchAllVendors(filters));
    } catch (error) {
      console.error("Update failed", error);
      toast.error(error.message || "Failed to update vendor");
    }
  };

  const handleBulkStatusUpdate = (rows) => {
    const promises = rows.map((r) => dispatch(toggleVendorStatus(r._id)).unwrap());
    Promise.all(promises)
      .then(() => {
        toast.success("Vendor statuses updated.");
        dispatch(fetchAllVendors(filters));
      })
      .catch(() => {
        toast.error("Failed to update some vendor statuses.");
      });
  };

  const handleBulkDelete = (selectedRows) => {
    const promises = selectedRows.map((r) =>
      dispatch(deleteVendorAction(r._id)).unwrap()
    );
    Promise.all(promises)
      .then(() => {
        toast.success("Vendors deleted successfully");
        setBulkDeletePopup({ show: false, rows: [] });
      })
      .catch(() => {
        toast.error("Failed to delete some vendors");
      });
  };

  const handleFilterSubmit = (values) => {
    const status = Array.isArray(values.status)
      ? values.status[0] || ""
      : values.status || "";
    setFilters((prev) => ({ ...prev, status }));
    setShowFilterPanel(false);
  };

  const handleFilterReset = () => {
    setFilters({ search: "", status: "" });
  };

  const downloadActions = [
    { header: "Download List" },
    {
      label: "Download PDF",
      icon: <BsFilePdf className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridPDF({
          rows: filteredVendors,
          columns: getColumns(),
          filename: "vendors.pdf",
          title: "Vendors Details",
        });
      },
    },
    {
      label: "Download CSV",
      icon: <BsFileSpreadsheet className="w-4 h-4 text-[#7B7B7B]" />,
      onClick: () => {
        exportGridCSV({
          rows: filteredVendors,
          columns: getColumns(),
          filename: "vendors.csv",
        });
      },
    },
  ];

  const columns = getColumns(
    handleDeleteVendor,
    handleVendorStatusUpdate,
    handleViewVendor,
    handleEditVendorOpen
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4 w-full">
        <div className="relative flex-1 min-w-[150px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 h-10 w-full border border-gray-300 rounded-md"
            placeholder="Search here..."
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <ActionComponent
            actions={downloadActions}
            buttonClassName="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
            icon={<Download className="w-4 h-4 text-[#02C8DE]" />}
          />

          <button
            onClick={() => setShowFilterPanel(true)}
            className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 text-[#02C8DE]" />
          </button>

          <button
            onClick={() => setShowCreatePanel(true)}
            className="flex items-center justify-center gap-2 bg-[#02C8DE] text-white w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          >
            <img
              src="/icons/plusbutton.svg"
              alt="Add Vendor"
              width={18}
              height={18}
            />
            <span className="hidden sm:inline">Add Vendor</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        {vendorLoading && (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        )}
        {!vendorLoading && <GridCommonComponent
          data={filteredVendors || []}
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
            header: { bg: "bg-gray-100" },
          }}
          bulkActionsConfig={[
            {
              label: "Mark As Active/InActive",
              iconUrl: "/icons/markCompleted.svg",
              type: "action",
              onClick: (rows) => handleBulkStatusUpdate(rows),
            },
            {
              label: "Delete Vendor",
              iconUrl: "/icons/archiveClient.svg",
              type: "popUp",
              onClick: (rows) => setBulkDeletePopup({ show: true, rows }),
            },
          ]}
        />}
      </div>

      {/* Filter Panel */}
      <SlidePanel
        open={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        width="sm:max-w-md"
      >
        <VendorFilterForm
          initialValues={{ status: filters.status }}
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
        />
      </SlidePanel>

      {/* Create Vendor Panel */}
      <SlidePanel
        open={showCreatePanel}
        onClose={() => setShowCreatePanel(false)}
        width="sm:max-w-lg"
      >
        <CreateVendorForm
          onSubmit={handleCreateVendor}
          onCancel={() => setShowCreatePanel(false)}
        />
      </SlidePanel>

      {/* Edit Vendor Panel */}
      <SlidePanel
        open={showEditPanel}
        onClose={() => {
          setShowEditPanel(false);
          setEditVendor(null);
        }}
        width="sm:max-w-lg"
      >
        {editVendor && (
          <EditVendorForm
            vendor={editVendor}
            onSubmit={handleUpdateVendorSubmit}
            onCancel={() => {
              setShowEditPanel(false);
              setEditVendor(null);
            }}
          />
        )}
      </SlidePanel>

      {/* View Vendor Detail Panel */}
      <SlidePanel
        open={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        width="sm:max-w-[600px]"
      >
        {detailContent}
      </SlidePanel>

      {/* Delete Single Vendor Dialog */}
      <ConfirmDialog
        open={deletePopup.show}
        onClose={() => setDeletePopup({ show: false, row: null })}
        title="Delete Vendor?"
        description="Are you sure you want to delete this Vendor? Once deleted, this action cannot be undone."
        confirmLabel="Delete Vendor"
        confirmVariant="destructive"
        onConfirm={confirmDeleteVendor}
      />

      {/* Bulk Delete Vendors Dialog */}
      <ConfirmDialog
        open={bulkDeletePopup.show}
        onClose={() => setBulkDeletePopup({ show: false, rows: [] })}
        title="Delete Selected Vendors?"
        description="Are you sure you want to delete the selected Vendors? Once deleted, this action cannot be undone."
        confirmLabel="Delete Vendors"
        confirmVariant="destructive"
        onConfirm={() => handleBulkDelete(bulkDeletePopup.rows)}
      />
    </div>
  );
};

export default VendorPage;
