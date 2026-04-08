import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { createColumns } from "./columns";
import { SlidePanel } from "@/components/feedback";
import { ConfirmDialog } from "@/components/feedback";
import AddServiceForm from "./forms/AddServiceForm";
import {
  fetchStoreServices,
  removeService,
  editService,
  createService,
} from "@/state/store/storeSlice";
import { fetchAllCategories } from "@/state/ecom/ecomSlice";
import Spinner from "@/components/common/Spinner";
import { toast } from "sonner";

const ServicesPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const itemsPerPage = 10;

  const dispatch = useDispatch();
  const { services, loading, pagination } = useSelector((state) => state.salon);
  const { categories } = useSelector((state) => state.ecomOrders);

  const categoryOptions = categories.map((c) => ({
    label: c.categoryName,
    value: c._id,
  }));

  useEffect(() => {
    dispatch(fetchStoreServices({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const debouncedSearch = useMemo(() => {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setCurrentPage(1);
        dispatch(fetchStoreServices({ search: value, page: 1, limit: itemsPerPage }));
      }, 500);
    };
  }, [dispatch]);

  const handleDelete = useCallback(
    (service) => {
      if (!service?._id) return;
      dispatch(removeService(service._id))
        .unwrap()
        .then(() => toast.success("Service deleted successfully!"))
        .catch((err) => toast.error("Failed to delete service."));
    },
    [dispatch]
  );

  const handleEdit = useCallback(
    (id, data) => {
      const rawFiles = data?.services;
      const files = rawFiles
        ? (Array.isArray(rawFiles) ? rawFiles : [rawFiles]).filter(
            (f) => f instanceof File
          )
        : [];

      const payload = {
        name: data?.name?.trim() || "",
        description: data?.description || "",
        duration: parseInt(data?.duration, 10) || 0,
        base_price: parseFloat(data?.base_price) || 0,
        status: data?.status?.toLowerCase() || "inactive",
        category_id: data?.category_id?._id || data?.category_id || "",
        images_to_delete: data?.images_to_delete || [],
      };
      if (files.length) payload.services = files;

      dispatch(editService({ id, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("Service updated successfully!");
          dispatch(
            fetchStoreServices({ page: currentPage, limit: itemsPerPage })
          );
        })
        .catch(() => toast.error("Failed to update service."));
    },
    [dispatch, currentPage]
  );

  const handleAddService = useCallback(
    (data) => {
      const formData = new FormData();

      if (data.services) {
        const files = Array.isArray(data.services) ? data.services : [data.services];
        files.forEach((file) => formData.append("services", file));
      }

      formData.append("name", data?.name?.trim() || "");
      formData.append("description", data?.description?.trim() || "");
      formData.append("duration", Number(data?.duration));
      formData.append("base_price", Number(data?.base_price));
      formData.append("status", data.status?.toLowerCase() || "active");
      if (data.category_id) formData.append("category_id", data.category_id);

      dispatch(createService(formData))
        .unwrap()
        .then(() => {
          toast.success("Service added successfully!");
          setAddOpen(false);
        })
        .catch(() => toast.error("Failed to add service."));
    },
    [dispatch]
  );

  const columns = createColumns({ onDelete: handleDelete, onEdit: handleEdit, categoryOptions });

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner />
      </div>
    );

  if (!services)
    return <p className="text-center mt-16 text-gray-500">No Services Found</p>;

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
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE]/90"
          >
            <img src="/icons/plusbutton.svg" alt="Add Services" width={18} height={18} />
            Add Services
          </button>
        </div>
      </div>

      <GridCommonComponent
        data={(services || []).map((service) => ({
          ...service,
          serviceName: {
            name: service.name || "",
            profile: service.images?.[0] || "",
          },
        }))}
        options={{ select: false, order: false }}
        columns={columns}
        header={{ bg: "bg-gray-100" }}
        pagination={{
          currentPage: pagination?.page,
          totalPages: pagination?.totalPages,
          totalItems: pagination?.total,
          itemsPerPage: pagination?.limit,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />

      <SlidePanel open={addOpen} onClose={() => setAddOpen(false)} width="sm:max-w-lg">
        <AddServiceForm
          categoryOptions={categoryOptions}
          onSubmit={handleAddService}
          onCancel={() => setAddOpen(false)}
        />
      </SlidePanel>
    </div>
  );
};

export default ServicesPage;
