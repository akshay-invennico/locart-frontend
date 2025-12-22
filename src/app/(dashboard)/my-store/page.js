"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreDetails, updateStore} from "@/state/store/storeSlice";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/DynamicFormRendering";
import { getStoreFormConfig, bannerProfileConfig } from "./config";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { contactColumn, hoursColumns } from "./column";
import Spinner from "@/components/common/Spinner";
import CreateStore from "@/components/store/CreateStore";


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

export const BannerProfile = ({ store }) => {
  return (
    <div className="w-full border rounded-lg overflow-hidden shadow-md mb-6">
      {/* Cover Image */}
      <div className="relative w-full h-64 bg-gray-200">
        {store?.coverImage && (
          <Image
            src={store?.coverImage}
            alt="Cover Image"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Profile Avatar */}
        <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white overflow-hidden">
          {store?.profileImage ? (
            <Image
              src={store?.profileImage}
              alt="Profile Image"
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400"></div>
          )}
        </div>
      </div>

      {/* Store Info */}
      <div className="pt-16 px-6 pb-6">
        <h1 className="text-2xl font-bold text-[#1B1B1B]">{store.storeName}</h1>

        {/* About */}
        <div className="mt-2">
          <h2 className="text-sm font-medium text-gray-500">
            {store.aboutStoreHeader}
          </h2>
          <p className="text-gray-600 mt-1">{store.aboutStoreText}</p>
        </div>

        {/* Location & Map */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col gap-1 text-gray-600">
            <span className="font-medium">{store.locationHeader}</span>
            <span>{store.locationText}</span>
          </div>

          <button
            onClick={() => {
              if (store.mapLink) {
                window.open(store.mapLink, "_blank");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary1 border border-primary1 rounded-lg hover:bg-primary1/10 transition"
          >
            <Image
              src="/icons/map.svg"
              width={18}
              height={18}
              alt="compass icon"
            />
            <span className="text-sm font-medium">Map Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MyStorePage = () => {
  const dispatch = useDispatch();
  const { store, loading } = useSelector((state) => state.salon);
  const storeId = store?._id;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  useEffect(() => {
    dispatch(fetchStoreDetails());
  }, [dispatch, isCreateModalOpen]);

  const handleUpdateStore = (updatedData) => {
    dispatch(updateStore({ id: storeId, data: updatedData }));
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
  
          <div className="text-center text-gray-500 text-xl">
            No Store Found
          </div>
  
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



  const getContactInfo = (store) => [
    { label: "Phone", value: store?.phone || "-" },
    { label: "Email", value: store?.email || "-" },
    {
      label: "Website",
      value: store?.website ? (
        <a
          href={store.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary1 underline"
        >
          {store.website}
        </a>
      ) : (
        "-"
      ),
    },
    {
      label: "Social Links",
      value: (
        <div className="flex items-center gap-3">
          {store?.facebook && (
            <a
              href={store.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
              />
            </a>
          )}
          {store?.instagram && (
            <a
              href={store.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </a>
          )}
          {store?.linkedin && (
            <a
              href={store.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/linkedin.svg"
                alt="Linkedin"
                width={20}
                height={20}
              />
            </a>
          )}
          {store?.twitter && (
            <a
              href={store.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/twitter.svg"
                alt="Twitter"
                width={20}
                height={20}
              />
            </a>
          )}
        </div>
      ),
    },
  ];


  return (
    <div>
      {/* Edit Store Action */}
      <div className="flex justify-end mb-4">
        <ActionComponent
          actions={[
            {
              type: "sidebar",
              component: (
                <DynamicForm
                  config={getStoreFormConfig("edit")}
                  isEdit={true}
                  initialValues={mappedStore}
                  onApply={handleUpdateStore}
                />
              ),
            },
          ]}
          icon={
            <Image
              src="/icons/create_store.svg"
              alt="edit button"
              width={20}
              height={20}
            />
          }
          text="Edit Store"
          buttonClassName="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
        />
      </div>

      {/* Banner + Details */}
      <div className="mb-6">
        <BannerProfile store={mappedStore} />
      </div>

      {/* Hours + Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-2">Operating Hours </h2>
          <div className="h-[1px] bg-gray-200 mb-4"></div>
          <GridCommonComponent
            data={formattedHours || []}
            options={{ select: false, order: false }}
            columns={hoursColumns}
            theme={{
              border: "border-gray-300",
              header: { bg: "bg-gray-100" },
            }}
          />
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Contact Info</h2>
          <div className="h-[1px] bg-gray-200 mb-4"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 text-sm">
            {getContactInfo(store).map((row, index) => {
              const labelRenderer = contactColumn.find(
                (col) => col.key === "label"
              )?.render;
              const valueRenderer = contactColumn.find(
                (col) => col.key === "value"
              )?.render;

              return (
                <React.Fragment key={index}>
                  <div className="font-semibold text-gray-700">
                    {labelRenderer(row)}
                  </div>
                  <div className="text-primary1 break-words">
                    {valueRenderer(row)}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStorePage;
