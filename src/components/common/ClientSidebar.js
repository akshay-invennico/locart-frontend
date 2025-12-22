"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSideBarStore } from "@/state/useSideBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

const ClientSidebar = ({ sidebarItems, sidebarHeader }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isClientSidebarOpen, closeAll } = useSideBarStore();
  const isMobile = useIsMobile();

  // const isActive = (url) => {
  //   return pathname === url || pathname.startsWith(url + "/");
  // };

  const isActive = (url) => {
    const normalizePath = (path) => path.replace(/\/$/, "");
    const normalizedUrl = normalizePath(url);
    const normalizedPath = normalizePath(pathname);

    // Exact match
    if (normalizedPath === normalizedUrl) return true;

    // Only highlight subpath if it matches fully and is the longest match
    return (
      normalizedPath.startsWith(normalizedUrl + "/") &&
      normalizedUrl !== "/my-store" 
    );
  };

  // Handle navigation click - use router for navigation on mobile
  const handleNavClick = (e, url) => {
    if (isMobile) {
      e.preventDefault();
      closeAll();
      setTimeout(() => {
        router.push(url);
      }, 300);
    }
  };

  // Close both sidebars when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isClientSidebarOpen) return;

    const handleClickOutside = (e) => {
      const clientSidebar = document.querySelector(".client-sidebar");
      const leftSidebar = document.querySelector(".left-sidebar");
      const hamburger = document.querySelector('[data-hamburger="true"]');

      // Check if click is outside both sidebars and hamburger
      if (
        clientSidebar &&
        !clientSidebar.contains(e.target) &&
        (!leftSidebar || !leftSidebar.contains(e.target)) &&
        (!hamburger || !hamburger.contains(e.target))
      ) {
        closeAll();
      }
    };

    // Use a slight delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isClientSidebarOpen, closeAll]);

  // Debug: Log when sidebar is open
  useEffect(() => {
    if (isMobile) {
      console.log("ClientSidebar isOpen:", isClientSidebarOpen);
    }
  }, [isClientSidebarOpen, isMobile]);

  return (
    <>
      {/* Mobile Overlay - covers entire screen but BEHIND sidebar */}
      {isMobile && isClientSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] md:hidden"
          onClick={closeAll}
          style={{ pointerEvents: "auto" }}
        />
      )}

      {/* Sidebar - ABOVE overlay */}
      <div
        className={`client-sidebar w-[220px] h-full bg-white border-r border-gray-200 transition-all duration-500 ease-in-out
          ${isMobile ? "fixed top-0 z-[60]" : "relative"}
          ${isMobile && isClientSidebarOpen ? "left-[72px]" : ""}
          ${isMobile && !isClientSidebarOpen ? "left-[-250px]" : ""}
        `}
        style={{ pointerEvents: "auto" }}
      >
        <div className="py-4">
          <div className="px-3 text-gray-400 text-sm mb-3">{sidebarHeader}</div>
          <nav className="flex flex-col gap-2 px-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                onClick={(e) => handleNavClick(e, item.url)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive(item.url)
                      ? "border border-primary1 text-primary1 bg-primary1/10"
                      : "text-black hover:bg-gray-100"
                  }`}
                style={{
                  position: "relative",
                  zIndex: 70,
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default ClientSidebar;
