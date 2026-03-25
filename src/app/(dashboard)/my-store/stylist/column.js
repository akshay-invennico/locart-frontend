"use client";

import { useEffect, useState } from "react";
import PopupForm from "@/components/ui/popupform";
import StarRating from "@/components/ui/starRating";
import {
  deleteStylistConfig,
  EditStylistConfig,
  getStylistDetailsConfig,
} from "./config";
import DetailView from "@/components/modules/DetailView";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import {
  fetchStylistsById,
  removeStylist,
  fetchStylists,
} from "@/state/stylist/stylistSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Spinner from "@/components/common/Spinner";
import { useUserContext } from "@/hooks/useUserContext";

export const useStylistColumns = (handleUpdateStylist) => {
  const dispatch = useDispatch();

  const columns = [
    {
      key: "fullName",
      title: "Stylist Name",
      isObject: true,
      structure: {
        name: "fullName",
        profile: "avatarUrl",
      },
      component: {
        type: "standard_avatar",
        style: {
          radius: "rounded-full",
          maxWidth: "180px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      },
    },

    {
      key: "phone",
      title: "Phone",
      component: {
        type: "phone",
        style: {
          color: "#02D8CE",
        },
      },
    },
    {
      key: "joinedOn",
      title: "Joined On",
      component: {
        type: "date",
        style: {},
        options: {
          format: "M d yyyy",
        },
        style: {
          color: "#7B7B7B",
        },
      },
    },
    {
      key: "totalBookings",
      title: "Total Booking",
      component: {
        style: {
          color: "#7B7B7B",
        },
      },
    },
    {
      key: "totalEarnings",
      title: "Total Earning",
      component: {
        type: "currency",
        style: {},
        sign: "$",
        position: "start",
      },
    },

    {
      key: "rating",
      title: "Rating",
      sortable: true,
      render: (value) => (
        <div className="text-black-500">
          <StarRating value={value} />
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      component: {
        type: "badge",
        style: {
          borderRadius: "0.15rem",
        },
        options: {
          value: {
            active: "#00A78E",
            completed: "#9CA3AF",
            cancelled: "#EF4444",
          },
        },
      },
    },
    {
      key: "actions",
      title: "Actions",
      component: {
        type: "action",
        style: {},
        options: {
          actions: [
            {
              label: "View Stylist Profile",
              iconUrl: "/icons/show.svg",
              type: "sidebar",
              component: (row) => <ViewStylistAction row={row} />,
            },

            {
              label: "Edit Stylist Profile",
              iconUrl: "/icons/editService.svg",
              type: "sidebar",
              component: (row) => (
                <EditStylistSidebar
                  row={row}
                  handleUpdateStylist={handleUpdateStylist}
                />
              ),
            },

            {
              label: "Delete Stylist",
              iconUrl: "/icons/deleteService.svg",
              type: "popUp",
              component: (row) => (
                <PopupForm
                  config={deleteStylistConfig}
                  width="500px"
                  height="500px"
                  onApply={async () => {
                    await dispatch(removeStylist(row._id));
                    await dispatch(fetchStylists());
                    close();
                  }}
                  onCancel={() => console.log("Cancelled")}
                />
              ),
            },
          ],
        },
      },
    },
  ];
  return columns;
};

const EditStylistSidebar = ({ row, handleUpdateStylist }) => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.salon);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      if (row?._id) {
        try {
          const result = await dispatch(fetchStylistsById(row._id)).unwrap();
          const stylistData = result?.data?.stylist || result?.stylist || {};

          setInitialValues({
            id: stylistData._id,
            fullName: stylistData.fullName,
            nickname: stylistData.nickname,
            specialization: stylistData.specialization || "",
            email: stylistData.email,
            phoneNumber: stylistData.phone || stylistData.phoneNumber,
            services: (stylistData.services || []).map((s) => s._id || s),
            workingDays: stylistData.workingDays || [],
            workingHours_from: stylistData.workingHours?.start || "09:00",
            workingHours_to: stylistData.workingHours?.end || "17:00",
            experience_years: stylistData.experience_years,
            status: stylistData.status
              ? [
                stylistData.status.charAt(0).toUpperCase() +
                stylistData.status.slice(1).toLowerCase(),
              ]
              : ["Active"],
            about: stylistData.about,
          });
        } catch (error) {
          console.error("Failed to fetch stylist details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [row?._id, dispatch]);

  const serviceOptions =
    services?.map((s) => ({
      value: s._id,
      label: s.name,
    })) || [];

  const updatedConfig = {
    ...EditStylistConfig,
    initialValues: initialValues,
    fields: EditStylistConfig.fields.map((f) =>
      f.name === "services" && f.type === "selectCheckbox"
        ? { ...f, options: serviceOptions }
        : f
    ),
    footer: {
      ...EditStylistConfig.footer,
      apply: {
        ...EditStylistConfig.footer.apply,
        onClick: (data) => {
          return handleUpdateStylist({ ...data, id: row._id });
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return <DynamicForm config={updatedConfig} isEdit={true} />;
};

const ViewStylistAction = ({ row, onCancel }) => {
  const dispatch = useDispatch();
  const [stylistData, setStylistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadComponent = async () => {
      try {
        if (!row?._id) return;

        setIsLoading(true);
        const result = await dispatch(fetchStylistsById(row._id)).unwrap();

        if (isMounted) {
          setStylistData(result?.data?.stylist || result?.stylist || {});
        }
      } catch (error) {
        console.error("Error loading stylist details:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadComponent();
    return () => { isMounted = false; };
  }, [row?._id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner />
      </div>
    );
  }

  if (!stylistData) {
    return <div>Error loading stylist details</div>;
  }

  return (
    <DetailView
      config={getStylistDetailsConfig(stylistData)}
      loading={false}
      data={stylistData}
      onClose={onCancel}
    />
  );
};

export default ViewStylistAction;
