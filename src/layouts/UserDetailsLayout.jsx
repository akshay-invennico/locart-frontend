import { Outlet, useParams } from "react-router-dom";
import ClientSidebar from "@/components/common/ClientSidebar";
import { clientSidebarItems } from "@/components/common/SidebarData";

export default function UserDetailsLayout() {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 sm:gap-2 relative">
      <div className="hidden md:block w-[220px] flex-shrink-0 sticky top-0 overflow-y-auto">
        <ClientSidebar sidebarItems={clientSidebarItems(id)} sidebarHeader="Clients" />
      </div>

      <div className="md:hidden">
        <ClientSidebar sidebarItems={clientSidebarItems(id)} sidebarHeader="Clients" />
      </div>

      <div className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
