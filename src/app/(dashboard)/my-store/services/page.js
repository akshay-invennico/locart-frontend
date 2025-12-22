"use client";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createColumns } from "./column";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { addServiceConfig } from "./config";
import Image from "next/image";
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
  const [search, setSearch] = React.useState("");

  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.salon);
  const { categories } = useSelector((state) => state.ecomOrders);

  const categoryOptions = categories.map((c) => ({
    label: c.categoryName,
    value: c._id,
  }));

  useEffect(() => {
    dispatch(fetchStoreServices());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value) => {
        dispatch(fetchStoreServices({ search: value }));
      }, 500),
    [dispatch]
  );

  const handleDelete = useCallback(
    (service) => {
      if (!service?._id) return;
      dispatch(removeService(service._id))
        .unwrap()
        .then(() => {
          toast.success("Service deleted successfully!");
        })
        .catch((err) => {
          toast.error("Failed to delete service." || err);
        });
    },
    [dispatch]
  );

  const handleEdit = useCallback(
    (id, data) => {
      const payload = {
        name: data?.name?.trim() || "",
        icon: data?.icon || "",
        description: data?.description || "",
        duration: parseInt(data?.duration, 10) || 0,
        base_price: parseFloat(data?.base_price) || 0,
        status: data?.status?.toLowerCase() || "inactive",
        category_id: data?.category_id || "",
      };

      dispatch(editService({ id, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("Service updated successfully!");
        })
        .catch((err) => {
          toast.error("Failed to update service." || err);
        });
    },
    [dispatch]
  );

  const handleAddService = useCallback(
    (data) => {
      const formData = new FormData();

      if (data.icon) {
        const file = Array.isArray(data.icon) ? data.icon[0] : data.icon;
        formData.append("icon", file);
      }

      formData.append("name", data?.name?.trim() || "");
      formData.append("description", data?.description?.trim() || "");
      formData.append("duration", Number(data?.duration));
      formData.append("base_price", Number(data?.base_price));
      formData.append("status", data.status?.toLowerCase() || "active");

      if (data.category_id) {
        formData.append("category_id", data.category_id);
      }

      console.log("FORM DATA SUBMITTED:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      dispatch(createService(formData))
        .unwrap()
        .then(() => {
          toast.success("Service added successfully!");
        })
        .catch((err) => {
          toast.error("Failed to add service." || err);
        });
    },
    [dispatch]
  );

  const options = {
    select: false,
    order: false,
  };

  const columns = createColumns({ onDelete: handleDelete, onEdit: handleEdit , categoryOptions});

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
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={addServiceConfig(handleAddService, categoryOptions)}
                  />
                ),
              },
            ]}
            icon={
              <Image
                src="/icons/plusbutton.svg"
                alt="Add Services"
                width={18}
                height={18}
              />
            }
            text="Add Services"
            buttonClassName="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          />
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={(services || []).map((service) => ({
            ...service,
            serviceName: {
              name: service.name || "",
              profile: service.icon || "",
            },
          }))}
          options={options}
          columns={columns}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
        />
      </div>
    </div>
  );
};

export default ServicesPage;
