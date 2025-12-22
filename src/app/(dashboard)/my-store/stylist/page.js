"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import { useStylistColumns } from "./column";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import {
  addStylistConfig,
  deleteStylistConfigAll,
} from "./config";
import Image from "next/image";
import { BsFilePdf, BsFileSpreadsheet } from "react-icons/bs";
import PopupForm from "@/components/ui/popupform";
import { fetchStylists, addStylist, updateStylist } from "@/state/stylist/stylistSlice";
import { fetchStoreServices } from "@/state/store/storeSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { exportGridCSV, exportGridPDF } from "@/lib/HelpFulFunction";

const StylistPage = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const stylistData = useSelector((state) => state.stylists.stylists);
  const { services } = useSelector((state) => state.salon);
  const stylistColumns = useStylistColumns();

  useEffect(() => {
    dispatch(fetchStylists());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStoreServices());
  }, []);

  const serviceOptions =
    services?.map((s) => ({
      value: s._id,
      label: s.name,
    })) || [];

  const filteredStylists = React.useMemo(() => {
    if (!Array.isArray(stylistData)) return [];

    return stylistData.filter((item) => {
      const name = item?.fullName?.toLowerCase() || "";
      const phone = item?.phoneNumber?.toLowerCase() || "";
      const searchLower = search.toLowerCase();

      return name.includes(searchLower) || phone.includes(searchLower);
    });
  }, [stylistData, search]);

  const updatedConfig = {
    ...addStylistConfig,
    fields: addStylistConfig.fields.map((f) =>
      f.name === "services" && f.type === "selectCheckbox"
        ? { ...f, options: serviceOptions }
        : f
    ),
  };

  const options = {
    select: true,
    order: false,
  };

  const handleAddStylist = async (data) => {

    const statusRaw = data?.status;
    const status = Array.isArray(statusRaw)
      ? statusRaw[0]?.toLowerCase() || "active"
      : typeof statusRaw === "string"
        ? statusRaw.toLowerCase()
        : "active";

    const payload = {
      fullName: data?.fullName?.trim() || "",
      email: data?.email?.trim() || "",
      phoneNumber: data?.phoneNumber?.trim() || "",
      services: Array.isArray(data?.services) ? data.services : [],
      workingDays: Array.isArray(data?.workingDays) ? data.workingDays : [],
      workingHours: {
        start: data?.workingHours_from || "09:00",
        end: data?.workingHours_to || "17:00",
      },
      experience_years: Number(data?.experience_years || 0),
      status: status,
      about: data?.textarea || "",
    };

    await dispatch(addStylist(payload));
    dispatch(fetchStylists());
  };

  const handleUpdateStylist = async (data) => {
    const statusRaw = data?.status;
    const status = Array.isArray(statusRaw)
      ? statusRaw[0]?.toLowerCase() || "active"
      : typeof statusRaw === "string"
        ? statusRaw.toLowerCase()
        : "active";

    const payload = {
      id: data?.id,
      fullName: data?.fullName?.trim() || "",
      email: data?.email?.trim() || "",
      phoneNumber: data?.phoneNumber?.trim() || "",
      services: Array.isArray(data?.services) ? data.services : [],
      workingDays: Array.isArray(data?.workingDays) ? data.workingDays : [],
      workingHours: {
        start: data?.workingHours_from || "09:00",
        end: data?.workingHours_to || "17:00",
      },
      experience_years: Number(data?.experience_years || 0),
      status: status,
      about: data?.textarea || "",
    };

    await dispatch(updateStylist(payload));
    dispatch(fetchStylists());
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative mb-2 w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <ActionComponent
            actions={[
              {
                type: "sidebar",
                component: (
                  <DynamicForm
                    config={{
                      ...updatedConfig,
                      footer: {
                        ...updatedConfig.footer,
                        apply: {
                          ...updatedConfig.footer.apply,
                          onClick: handleAddStylist,
                        },
                      },
                    }}
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
            text="Add Stylist"
            buttonClassName="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
          />
        </div>
      </div>

      <div className="w-full">
        <GridCommonComponent
          data={filteredStylists}
          options={options}
          columns={useStylistColumns(handleUpdateStylist)}
          theme={{
            border: "border-gray-300",
            header: {
              bg: "bg-gray-100",
            },
          }}
          bulkActionsConfig={[
            {
              label: "Delete Stylist",
              iconUrl: "/icons/suspendClient.svg",
              component: (
                <PopupForm
                  config={deleteStylistConfigAll}
                  width="500px"
                  onApply={(data) => console.log("Suspended:", data)}
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
    </div>
  );
};

export default StylistPage;
