import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreDetails, updateStore } from "@/state/store/storeSlice";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { contactColumn, hoursColumns } from "./columns";
import { SlidePanel } from "@/components/feedback";
import StoreEditForm from "./forms/StoreEditForm";
import Spinner from "@/components/common/Spinner";
import CreateStore from "@/components/store/CreateStore";
import { toast } from "sonner";

const mapStoreData = (data) => ({
  storeName: data.name,
  profileImage: data.logo,
  coverImage: data.coverImage,
  aboutStoreHeader: "About the Store",
  aboutStoreText: data.about,
  locationHeader: "Location",
  locationText: `${data.streetAddress}, ${data.city}, ${data.state} - ${data.zipCode}`,
  mapLink: data.mapLink,
  ...data,
});

const BannerProfile = ({ store }) => (
  <div className="w-full border rounded-lg overflow-hidden shadow-md mb-6">
    <div className="relative w-full h-64 bg-gray-200">
      {store?.coverImage && (
        <img
          src={store.coverImage}
          alt="Cover Image"
          className="object-cover w-full h-full"
        />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white overflow-hidden">
        {store?.profileImage ? (
          <img
            src={store.profileImage}
            alt="Profile"
            width={96}
            height={96}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400" />
        )}
      </div>
    </div>
    <div className="pt-16 px-6 pb-6">
      <h1 className="text-2xl font-bold text-[#1B1B1B]">{store.storeName}</h1>
      <div className="mt-2">
        <h2 className="text-sm font-medium text-gray-500">{store.aboutStoreHeader}</h2>
        <p className="text-gray-600 mt-1">{store.aboutStoreText}</p>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col gap-1 text-gray-600">
          <span className="font-medium">{store.locationHeader}</span>
          <span>{store.locationText}</span>
        </div>
        <button
          onClick={() => store.mapLink && window.open(store.mapLink, "_blank")}
          className="flex items-center gap-2 px-4 py-2 bg-white text-primary1 border border-primary1 rounded-lg hover:bg-primary1/10 transition"
        >
          <img src="/icons/map.svg" width={18} height={18} alt="compass icon" />
          <span className="text-sm font-medium">Map Directions</span>
        </button>
      </div>
    </div>
  </div>
);

const MyStorePage = () => {
  const dispatch = useDispatch();
  const { store, loading } = useSelector((state) => state.salon);
  const storeId = store?._id;
  const [editOpen, setEditOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStoreDetails());
  }, [dispatch, isCreateModalOpen]);

  const handleUpdateStore = async (values) => {
    try {
      await dispatch(updateStore({ id: storeId, data: values })).unwrap();
      toast.success("Store updated successfully");
      setEditOpen(false);
      dispatch(fetchStoreDetails());
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Failed to update store"
      );
    }
  };

  if (loading)
    return (
      <div className="text-center mt-16 text-gray-500">
        <Spinner />
      </div>
    );

  if (!store)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="absolute top-5 right-5 bg-primary1 text-white px-4 py-2 rounded-md hover:bg-primary1 cursor-pointer"
        >
          Create Store
        </button>
        <div className="text-center text-gray-500 text-xl">No Store Found</div>
        {isCreateModalOpen && (
          <CreateStore onClose={() => setIsCreateModalOpen(false)} />
        )}
      </div>
    );

  const mappedStore = mapStoreData(store);

  const formattedHours =
    store?.operatingHours?.map((item) => ({
      day: item.day,
      time: item.isOpen ? `${item.open} - ${item.close}` : "Closed",
    })) || [];

  const getContactInfo = (s) => [
    { label: "Phone", value: s?.phone || "-" },
    { label: "Email", value: s?.email || "-" },
    {
      label: "Website",
      value: s?.website ? (
        <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-primary1 underline">
          {s.website}
        </a>
      ) : "-",
    },
    {
      label: "Social Links",
      value: (
        <div className="flex items-center gap-3">
          {s?.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer"><img src="/icons/facebook.svg" alt="Facebook" width={20} height={20} /></a>}
          {s?.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer"><img src="/icons/instagram.svg" alt="Instagram" width={20} height={20} /></a>}
          {s?.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer"><img src="/icons/linkedin.svg" alt="Linkedin" width={20} height={20} /></a>}
          {s?.twitter && <a href={s.twitter} target="_blank" rel="noopener noreferrer"><img src="/icons/twitter.svg" alt="Twitter" width={20} height={20} /></a>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE]/90"
        >
          <img src="/icons/create_store.svg" alt="edit" width={20} height={20} />
          Edit Store
        </button>
      </div>

      <BannerProfile store={mappedStore} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-2">Operating Hours</h2>
          <div className="h-px bg-gray-200 mb-4" />
          <GridCommonComponent
            data={formattedHours || []}
            options={{ select: false, order: false }}
            columns={hoursColumns}
            theme={{ border: "border-gray-300", header: { bg: "bg-gray-100" } }}
          />
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Contact Info</h2>
          <div className="h-px bg-gray-200 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 text-sm">
            {getContactInfo(store).map((row, index) => {
              const labelRenderer = contactColumn.find((col) => col.key === "label")?.render;
              const valueRenderer = contactColumn.find((col) => col.key === "value")?.render;
              return (
                <React.Fragment key={index}>
                  <div className="font-semibold text-gray-700">{labelRenderer(row)}</div>
                  <div className="text-primary1 wrap-break-word">{valueRenderer(row)}</div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <SlidePanel
        open={editOpen}
        onClose={() => setEditOpen(false)}
        width="sm:max-w-lg"
      >
        <StoreEditForm
          initialValues={mappedStore}
          onSubmit={handleUpdateStore}
          onCancel={() => setEditOpen(false)}
        />
      </SlidePanel>
    </div>
  );
};

export default MyStorePage;
