"use client";

import { useState } from "react";
import { Download, Filter, Plus } from "lucide-react"; // import plus icon
import { Button } from "@/components/ui/button";
import TopPoints from "./toppoints/TopPoints";
import BadgeSection from "./badge/BadgeSection";
import ViewUser from "../../viewUser";
import ActionComponent from "@/components/grid/actionComponent";
import DynamicForm from "@/components/modules/registry";

const addBadgeConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Assign Badge to Client" },
    {
      type: "subheader",
      text: "Use this to manually assign badge to the client's account.",
    },
    { type: "divider" },
    { type: "SelectBadge", text: "Select Badge" },

    {
      type: "select",
      name: "Badge",
      label: "Select Badge",
      options: [
        { value: "FreshStart", label: "Fresh Start" },
        { value: "ReferralKing", label: "Referral King" },
        { value: "ProductLover", label: "Product Lover" },
        { value: "LoyalLo'cer", label: "Loyal Lo’ceL" },
        { value: "ReviewRockstar", label: "Review Rockstar" },
        { value: "MonthlyHero", label: "Monthly Hero" },
        { value: "ComboKing", label: "Combo King" },
        { value: "ProfilePro", label: "Profile Pro" },
      ],
    },
    {
      type: "select",
      name: "Reason",
      label: "Select Reason",
      options: [
        { value: "Bookingnotcredited", label: "Booking not credited" },
        { value: "Referralissue", label: "Referral issue" },
        { value: "Manualadjustment", label: "Manual adjustment" },
        { value: "Other", label: "Other" },
      ],
    },
  ],
  footer: {
    cancel: {
      label: "Cancel",
      className: "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: () => console.log("Cancelled"),
    },
    apply: {
      label: "Add Badge",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Badge Added", data),
    },
  },
};
const addPointsConfig = {
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  fields: [
    { type: "header", label: "Add Loyalty Points" },
    {
      type: "subheader",
      text: "Use this to manually credit points to the Client's account.",
    },
    { type: "divider" },
    { type: "AddPoints", text: "Points to Add" },

     {
      type: "select",
      name: "AddPoints",
      label: "Points to Add",
      options: [
        { value: "10pts", label: "10pts" },
        { value: "20pts", label: "20pts" },
        { value: "30pts", label: "30pts" },
        { value: "40pts", label: "40pts" },
      ],
    },

     {
      type: "select",
      name: "Reason",
      label: "Select Reason",
      options: [
        { value: "Bookingnotcredited", label: "Booking not credited" },
        { value: "Referralissue", label: "Referral issue" },
        { value: "Manualadjustment", label: "Manual adjustment" },
        { value: "Other", label: "Other" },
      ],
    },
  ],
    footer: {
    cancel: {
      label: "Cancel",
      className: "w-full border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded",
      onClick: () => console.log("Cancelled"),
    },
    apply: {
      label: "Add Points",
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: (data) => console.log("Saved", data),
    },
  },
};


export default function Page() {

  return (
    <div className="w-full h-full">
      <div className="flex justify-end gap-4 mb-4">
        {/* Add Badge Button */}
        <ActionComponent
          actions={[
            {
              type: "sidebar",
              component: <DynamicForm config={addBadgeConfig} />,
            },
          ]}
          icon={<Plus className="w-4 h-4" />}
          text="Add Badge"
          buttonClassName="inline-flex items-center gap-2 border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded-md hover:bg-blue-50"
        />

        {/* Add Points Button */}
        <ActionComponent
          actions={[
            {
              type: "sidebar",
              component: <DynamicForm config={addPointsConfig} />,
            },
          ]}
          icon={<Plus className="w-4 h-4" />}
          text="Add Points"
          buttonClassName="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE] hover:text-[#111111]"
        />
      </div>

      {/* Sections */}
      <TopPoints />
      <BadgeSection />
    </div>
  );
}
