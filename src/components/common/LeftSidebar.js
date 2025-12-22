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
import {
  leftSidebarItems,
  loctitianSidebarItems,
} from "./SidebarData";
import { useSelector } from "react-redux";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { isOpen, closeAll } = useSideBarStore();
  const isMobile = useIsMobile();
  const role = useSelector((state) => state?.auth?.role);

  const sidebarItems =
    role === "loctitian" ? loctitianSidebarItems : leftSidebarItems;

  const handleNavigation = () => {
    if (isMobile) closeAll();
  };

  const isActive = (url) =>
    pathname === url || pathname.startsWith(url + "/");

  const renderMenuItem = (item, index) => (
    <SidebarMenuItem key={index}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            asChild
            className={`w-8 h-8 p-0 flex items-center justify-center border rounded-[6px] transition-colors duration-200 ${isActive(item.url)
                ? "bg-[var(--color-primary1)] text-white border-[var(--color-secondary1)]"
                : "border-[var(--border-admin)] text-black hover:bg-[var(--color-primary1)] hover:text-white hover:border-[var(--color-secondary1)]"
              }`}
          >
            <Link
              href={item.url}
              onClick={handleNavigation}
              className="flex items-center justify-center"
              style={{ width: 32, height: 32 }}
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
        {/* Logo */}
        <SidebarGroupLabel>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                <AvatarImage src="/lockartLogo.png" alt="Locart" />
                <AvatarFallback>LO</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
          </Tooltip>
        </SidebarGroupLabel>

        {/* Single Divider */}
        <hr className="w-8 h-[0.5px] border border-[var(--border-admin)]" />

        {/* Menu Items */}
        <SidebarGroupContent className="w-full">
          <SidebarMenu className="flex flex-col items-center gap-3">
            {sidebarItems.map(renderMenuItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  return (
    <TooltipProvider>
      {isMobile ? (
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
