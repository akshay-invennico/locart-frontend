import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRating from "@/components/ui/starRating";
import Spinner from "@/components/common/Spinner";
import AddStylistForm from "./forms/AddStylistForm";
import StylistDetailsView from "./StylistDetailsView";
import {
  fetchStylistsById,
  removeStylist,
  fetchStylists,
} from "@/state/stylist/stylistSlice";
import { toast } from "sonner";

export const useStylistColumns = (handleUpdateStylist) => {
  const dispatch = useDispatch();

  const columns = [
    {
      key: "fullName",
      title: "Stylist Name",
      isObject: true,
      structure: { name: "fullName", profile: "avatarUrl" },
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
      component: { type: "phone", style: { color: "#02D8CE" } },
    },
    {
      key: "joinedOn",
      title: "Joined On",
      component: {
        type: "date",
        options: { format: "M d yyyy" },
        style: { color: "#7B7B7B" },
      },
    },
    {
      key: "totalBookings",
      title: "Total Booking",
      component: { style: { color: "#7B7B7B" } },
    },
    {
      key: "totalEarnings",
      title: "Total Earning",
      component: { type: "currency", sign: "$", position: "start" },
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
        style: { borderRadius: "0.15rem" },
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
                <DeleteStylistPopup row={row} dispatch={dispatch} />
              ),
            },
          ],
        },
      },
    },
  ];
  return columns;
};

const DeleteStylistPopup = ({ row, dispatch }) => {
  const handleDelete = async () => {
    const id = row?._id || row?.id;
    if (!id) {
      toast.error("Stylist ID missing — cannot delete.");
      return;
    }
    try {
      await dispatch(removeStylist(id)).unwrap();
      toast.success("Stylist deleted successfully");
      await dispatch(fetchStylists());
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Failed to delete stylist"
      );
    }
  };

  return (
    <div className="p-6 text-center">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Stylist?</h3>
      <p className="text-sm text-gray-500 mb-1">
        Are you sure you want to permanently remove this stylist's profile?
      </p>
      <p className="text-sm text-gray-500 mb-4">
        This action cannot be reversed and will delete all related information.
      </p>
      <div className="flex gap-3">
        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded">
          Cancel
        </button>
        <button
          className="flex-1 bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          Delete Stylist
        </button>
      </div>
    </div>
  );
};

const EditStylistSidebar = ({ row, handleUpdateStylist }) => {
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.salon);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      const stylistId = row?._id || row?.id;
      if (stylistId) {
        try {
          const result = await dispatch(fetchStylistsById(stylistId)).unwrap();
          const stylistData =
            result?.data?.stylist || result?.stylist || result?.data || result || {};

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
              ? stylistData.status.charAt(0).toUpperCase() +
              stylistData.status.slice(1).toLowerCase()
              : "Active",
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
    services?.map((s) => ({ value: s._id, label: s.name })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <AddStylistForm
      isEdit
      initialValues={initialValues}
      serviceOptions={serviceOptions}
      onSubmit={(values) =>
        handleUpdateStylist({ ...values, id: row._id || row.id })
      }
      onCancel={() => { }}
    />
  );
};

const ViewStylistAction = ({ row }) => {
  const dispatch = useDispatch();
  const [stylistData, setStylistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadComponent = async () => {
      try {
        const id = row?._id || row?.id;
        if (!id) {
          if (isMounted) setIsLoading(false);
          return;
        }
        setIsLoading(true);
        const result = await dispatch(fetchStylistsById(id)).unwrap();
        if (isMounted) {
          setStylistData(
            result?.data?.stylist || result?.stylist || result?.data || result || {}
          );
        }
      } catch (error) {
        console.error("Error loading stylist details:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadComponent();
    return () => {
      isMounted = false;
    };
  }, [row?._id, row?.id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner />
      </div>
    );
  }

  if (!stylistData) {
    return <div className="p-4 text-gray-500">No stylist data available</div>;
  }

  return <StylistDetailsView row={row} stylist={stylistData} />;
};
