"use client";
import ClientSidebar from "@/components/common/ClientSidebar";
import { myEcomSidebarItems } from "@/components/common/SidebarData";
import React from "react";

export default function MyEcommPageLayout({ children }) {
  return (
    <div className="flex h-full gap-6 relative">
      {/* Desktop: Normal sidebar */}
      <div className="hidden md:block w-[220px] flex-shrink-0 sticky top-0 overflow-y-auto">
        <ClientSidebar sidebarItems={myEcomSidebarItems} sidebarHeader="My Ecom" />
      </div>
      
      {/* Mobile: Sliding sidebar (always rendered for proper animation) */}
      <div className="md:hidden">
        <ClientSidebar sidebarItems={myEcomSidebarItems} sidebarHeader="My Ecom"/>
      </div>
      
      {/* Content area */}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}