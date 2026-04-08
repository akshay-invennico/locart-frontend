import { useState, useEffect, useMemo } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import { toast } from "sonner";

import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { SlidePanel, ConfirmDialog } from "@/components/feedback";
import { useStylistColumns } from "./columns";
import AddStylistForm from "./forms/AddStylistForm";
import {
  fetchStylists,
  addStylist,
  updateStylist,
} from "@/state/stylist/stylistSlice";
import { fetchStoreServices } from "@/state/store/storeSlice";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";

const StylistPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const itemsPerPage = 10;

  const dispatch = useDispatch();
  const { stylists: stylistData, pagination } = useSelector(
    (state) => state.stylists
  );
  const { services } = useSelector((state) => state.salon);
  const stylistColumns = useStylistColumns();

  useEffect(() => {
    dispatch(fetchStylists({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(fetchStoreServices());
  }, []);

  const serviceOptions =
    services?.map((s) => ({ value: s._id, label: s.name })) || [];

  const filteredStylists = useMemo(() => {
    if (!Array.isArray(stylistData)) return [];
    return stylistData.filter((item) => {
      const name = item?.fullName?.toLowerCase() || "";
      const phone = item?.phoneNumber?.toLowerCase() || "";
      const searchLower = search.toLowerCase();
      return name.includes(searchLower) || phone.includes(searchLower);
    });
  }, [stylistData, search]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setCurrentPage(1);
        dispatch(
          fetchStylists({ search: value, page: 1, limit: itemsPerPage })
        );
      }, 500),
    [dispatch]
  );

  const buildFormData = (data) => {
    const statusRaw = data?.status;
    const status =
      typeof statusRaw === "string" ? statusRaw.toLowerCase() : "active";

    const formData = new FormData();
    formData.append("fullName", data?.fullName?.trim() || "");
    formData.append("email", data?.email?.trim() || "");
    formData.append("phoneNumber", data?.phoneNumber?.trim() || "");
    formData.append("experience", Number(data?.experience_years || 0));
    formData.append("status", status);
    formData.append("about", data?.about || "");
    formData.append("specialization", data?.specialization || "");

    if (Array.isArray(data?.services)) {
      data.services.forEach((service) => formData.append("services", service));
    }
    if (Array.isArray(data?.workingDays)) {
      data.workingDays.forEach((day) => formData.append("workingDays", day));
    }

    const start = data?.workingHours_from || "09:00";
    const end = data?.workingHours_to || "17:00";
    formData.append("workingHours", JSON.stringify({ start, end }));

    if (data?.profile_photo) {
      if (data.profile_photo instanceof File) {
        formData.append("profilePhoto", data.profile_photo);
      } else if (data.profile_photo?.file instanceof File) {
        formData.append("profilePhoto", data.profile_photo.file);
      }
    }

    return formData;
  };

  const handleAddStylist = async (values, { resetForm }) => {
    const formData = buildFormData(values);
    await dispatch(addStylist(formData));
    dispatch(fetchStylists({ page: currentPage, limit: itemsPerPage }));
    setAddOpen(false);
    resetForm();
  };

  const handleUpdateStylist = async (data) => {
    const id = data?.id || data?._id;
    if (!id) {
      toast.error("Stylist ID missing — cannot update.");
      return;
    }
    try {
      const formData = buildFormData(data);
      await dispatch(updateStylist({ id, formData })).unwrap();
      toast.success("Stylist updated successfully");
      dispatch(fetchStylists({ page: currentPage, limit: itemsPerPage }));
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Failed to update stylist"
      );
    }
  };

  const options = { select: true, order: false };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative mb-2 w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search here..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
            onClick={() => setAddOpen(true)}
          >
            <img
              src="/icons/plusbutton.svg"
              alt="Add Stylist"
              width={18}
              height={18}
            />
            Add Stylist
          </button>
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={filteredStylists}
          options={options}
          columns={useStylistColumns(handleUpdateStylist)}
          theme={{ border: "border-gray-300", header: { bg: "bg-gray-100" } }}
          pagination={{
            currentPage: pagination?.page,
            totalPages: pagination?.totalPages,
            totalItems: pagination?.total,
            itemsPerPage: pagination?.limit,
            onPageChange: (page) => setCurrentPage(page),
          }}
          bulkActionsConfig={[
            {
              label: "Delete Stylist",
              iconUrl: "/icons/suspendClient.svg",
              type: "popUp",
              component: (
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Delete Selected Stylist?
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Are you sure you want to permanently remove this stylist's
                    profile?
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    This action cannot be reversed and will delete all related
                    information.
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded">
                      Cancel
                    </button>
                    <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded">
                      Yes, Delete Stylist
                    </button>
                  </div>
                </div>
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
                      columns: stylistColumns,
                      filename: "stylists.pdf",
                      title: "Stylist Report",
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
                      columns: stylistColumns,
                      filename: "stylists.csv",
                    });
                  },
                },
              ],
            },
          ]}
        />
      </div>

      <SlidePanel
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title=""
        width="sm:max-w-lg"
      >
        <AddStylistForm
          serviceOptions={serviceOptions}
          onSubmit={handleAddStylist}
          onCancel={() => setAddOpen(false)}
        />
      </SlidePanel>
    </div>
  );
};

export default StylistPage;
