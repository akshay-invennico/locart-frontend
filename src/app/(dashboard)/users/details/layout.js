"use client";
import ClientSidebar from "@/components/common/ClientSidebar";
import { clientSidebarItems } from "@/components/common/SidebarData";
import React from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

export default function DetailsPageLayout({ children }) {
  const { id } = useParams();
    const pathname = usePathname();
  const dispatch = useDispatch();

  if (!id) {
    return <div className="flex-1 min-w-0 overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="flex h-full gap-6 sm:gap-2 relative">
      {/* Desktop: Normal sidebar */}
      <div className="hidden md:block w-[220px] flex-shrink-0 sticky top-0 overflow-y-auto">
        <ClientSidebar sidebarItems={clientSidebarItems(id)} sidebarHeader="Clients"/>
      </div>
      
      {/* Mobile: Sliding sidebar (always rendered for proper animation) */}
      <div className="md:hidden">
        <ClientSidebar sidebarItems={clientSidebarItems(id)} sidebarHeader="Clients"/>
      </div>
      
      {/* Content area */}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}