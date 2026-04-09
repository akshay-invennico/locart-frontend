import { Outlet } from "react-router-dom";
import ClientSidebar from "@/components/common/ClientSidebar";
import { myEcomSidebarItems } from "@/components/common/SidebarData";

export default function MyEcomLayout() {
  return (
    <div className="flex h-full gap-6 sm:gap-2 relative">
      <div className="hidden md:block w-[220px] shrink-0 sticky top-0 overflow-y-auto">
        <ClientSidebar sidebarItems={myEcomSidebarItems} sidebarHeader="My Ecom" />
      </div>

      <div className="md:hidden">
        <ClientSidebar sidebarItems={myEcomSidebarItems} sidebarHeader="My Ecom" />
      </div>

      <div className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
