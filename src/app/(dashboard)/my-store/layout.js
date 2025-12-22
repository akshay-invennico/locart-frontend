"use client";
import ClientSidebar from "@/components/common/ClientSidebar";
import { myStoreSidebarItems } from "@/components/common/SidebarData";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyStorePageLayout({ children }) {
  const user = useSelector((state) => state.auth?.user);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const storedRole = localStorage.getItem("role");


    const parsedRole =
      user?.roles?.[0]?.role_name?.toLowerCase() ||
      user?.role?.toLowerCase?.() ||
      (storedAuth ? JSON.parse(storedAuth)?.role : storedRole);

    setRole(parsedRole);
  }, [user]);

  const showSidebar = role && role !== "loctitian";

  return (
    <div className="flex h-full gap-6 relative">
      {showSidebar && (
        <>
          <div className="hidden md:block w-[220px] flex-shrink-0 sticky top-0 overflow-y-auto">
            <ClientSidebar
              sidebarItems={myStoreSidebarItems}
              sidebarHeader="My Store"
            />
          </div>

          {/* Mobile: Sliding sidebar (always rendered for proper animation) */}
          <div className="md:hidden">
            <ClientSidebar
              sidebarItems={myStoreSidebarItems}
              sidebarHeader="My Store"
            />
          </div>
        </>
      )}

      {/* Content area */}
      <div className="flex-1 min-w-0 overflow-x-hidden">{children}</div>
    </div>
  );
}
