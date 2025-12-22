"use client";
import React from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSideBarStore } from "@/state/useSideBar";
import { leftSidebarItems } from "./SidebarData";
import { loctitianSidebarItems } from "./SidebarData";
import { useSelector } from "react-redux";

const LeftSidebar = ({}) => {
  const pathname = usePathname();
  const { isOpen, closeAll } = useSideBarStore();
  const isMobile = useIsMobile();
  const role = useSelector((state) => state?.auth?.role);

  // Close sidebars when a navigation item is clicked on mobile
  const handleNavigation = () => {
    if (isMobile) {
      closeAll();
    }
  };

  const isActive = (url) => {
    return pathname === url || pathname.startsWith(url + "/");
  };

  const sidebarItems =
    role === "loctitian" ? loctitianSidebarItems : leftSidebarItems;

  const renderMenuItem = (item, index) => (
    <SidebarMenuItem key={index}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            asChild
            className={`w-8 h-8 p-0 flex items-center justify-center border rounded-[6px] transition-colors duration-200 ${
              isActive(item.url)
                ? "bg-[var(--color-primary1)] text-white border-[var(--color-secondary1)]"
                : "border-[var(--border-admin)] text-black hover:bg-[var(--color-primary1)] hover:text-white hover:border-[var(--color-secondary1)]"
            }`}
          >
            <Link
              href={item.url}
              className="flex items-center justify-center"
              onClick={handleNavigation}
              style={{
                width: "32px",
                height: "32px",
              }}
            >
              {item.icon}
            </Link>
          </SidebarMenuButton>
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  );

  const sidebarContent = (
    <SidebarContent className="flex flex-col items-center py-4 bg-white">
      <SidebarGroup className="flex flex-col items-center gap-4 w-full">
        <SidebarGroupLabel className="mb-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                <AvatarImage src="/lockartLogo.png" alt="@shadcn" />
                <AvatarFallback>LO</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
          </Tooltip>
        </SidebarGroupLabel>

        <hr className="w-8 h-[0.5px] border border-[var(--border-admin)]" />

        <SidebarGroupContent className="w-full">
          <SidebarMenu className="flex flex-col items-center gap-3">
            {role === "loctitian" ? (
              <>
                {/* left side bar items for loctition */}
                {sidebarItems
                  .slice(0, 3)
                  .map((item, index) => renderMenuItem(item, index))}

                <hr className="w-8 h-[0.5px] border border-[var(--border-admin)] my-1" />

                {sidebarItems[3] && renderMenuItem(sidebarItems[3], 3)}
              </>
            ) : (
              <>
                {/* left side bar items for merchant/admin role */}
                {sidebarItems
                  .slice(0, 4)
                  .map((item, index) => renderMenuItem(item, index))}

                <hr className="w-8 h-[0.5px] border border-[var(--border-admin)] my-1" />

                {sidebarItems
                  .slice(4, 6)
                  .map((item, index) => renderMenuItem(item, index + 4))}

                {/* the setting wil only displayed in the merchant/admin role */}
                {role !== "loctitian" && (
                  <>
                    <hr className="w-8 h-[0.5px] border border-[var(--border-admin)] my-1" />
                    {renderMenuItem(leftSidebarItems[6], 6)}
                  </>
                )}
              </>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  return (
    <TooltipProvider>
      {isMobile ? (
        // Mobile: Controlled sidebar with overlay
        <SidebarProvider open={isOpen}>
          <Sidebar
            open={isOpen}
            onOpenChange={closeAll}
            className="fixed left-0 top-0 h-full z-50 left-sidebar"
          >
            {sidebarContent}
          </Sidebar>
        </SidebarProvider>
      ) : (
        // Desktop: Always visible sidebar
        <SidebarProvider>
          <Sidebar className="w-[72px] fixed left-0 top-0 h-full bg-white z-50">
            {sidebarContent}
          </Sidebar>
        </SidebarProvider>
      )}
    </TooltipProvider>
  );
};

export default LeftSidebar;
