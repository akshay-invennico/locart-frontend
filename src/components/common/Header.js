"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RiMenu3Fill } from "react-icons/ri";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { LuBellDot } from "react-icons/lu";
import Image from "next/image";
import { useSideBarStore } from "@/state/useSideBar";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { useBreadcrumbStore } from "@/state/useBreadcrumbStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Notification from "@/components/common/Notification";
import { useUserContext } from "@/hooks/useUserContext";

// Map of routes to their display names
const routeMap = {
  "/": "Dashboard",
  "/users": "Clients",
  "/users/details": "Client Details",
  "/users/details/booking": "Bookings",
  "/users/details/product-orders": "Product Orders",
  "/users/details/loyalty-rewards": "Loyalty Rewards",

  "/my-store": "My Store",
  "/my-store/services": "Services",
  "/my-store/stylist": "Stylist",
  "/my-store/categories": "Categories",
  "/my-store/availability": "availability",
  "/my-store/portfolio": "Portfolio",
  "/my-store/amenities": "Amenities",

  "/appointments": "Appointments",

  "/my-ecom": "My Ecom",
  "/my-ecom/order": "Orders",
  "/my-ecom/order/create-in-store-order": "Create-In-Store-Order",
  "/my-ecom/product": "Products",
  "/my-ecom/categories": "Categories",
  "/my-ecom/offer": "Offers",

  "/education": "Education",
  "/payment-and-payouts": "Payment & Payouts",
  "/loyalty-rewards": "Loyalty & Rewards",
  "/settings": "Settings",

  "/profile": "My Profile",
};

const Header = () => {
  const router = useRouter();
  const { toggle, isOpen } = useSideBarStore();
  const pathname = usePathname();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const { user } = useUserContext();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { dynamicCrumb } = useBreadcrumbStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter((s) => s);
    let currentPath = "";
    const breadcrumbs = [];

    // Build the full path and find matching route
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      if (routeMap[currentPath]) {
        breadcrumbs.push({
          href: currentPath,
          label: routeMap[currentPath],
        });
      }
    });

    // Add dynamic crumb if present
    if (dynamicCrumb) {
      breadcrumbs.push({ href: "#", label: dynamicCrumb.label });
    }

    if (breadcrumbs.length === 0) {
      const routeName =
        pathname === "/" ? "Dashboard" : pathname.split("/").pop();
      breadcrumbs.push({
        href: pathname,
        label: routeName.charAt(0).toUpperCase() + routeName.slice(1),
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("role");
  router.push("/auth");
};


  return (
    <div className="flex items-center justify-between h-full px-6">
      <div className="hidden md:flex">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbItem key={breadcrumb.href}>
                  {!isLast ? (
                    <BreadcrumbLink
                      href={breadcrumb.href}
                      className="text-sm font-medium text-black hover:text-primary hover:underline"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <span className="text-sm font-medium text-black">
                      {breadcrumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <BreadcrumbSeparator className="mx-2"></BreadcrumbSeparator>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="md:hidden flex items-center">
        <Image src="/locart.svg" alt="logo" width={40} height={40} />
      </div>

      <div className="flex items-center gap-x-6">
        {/* Notification Pane */}
        <div className="relative" ref={notificationRef}>
          <div
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="w-[30px] h-[30px] border border-[var(--border-admin)] 
                   rounded-[6px] flex items-center justify-center shadow-sm cursor-pointer"
          >
            <LuBellDot className="text-xl text-gray-600" size={16} />
          </div>

          <Notification
            isOpen={isNotificationOpen}
            heading="Notification Feed"
            subHeading="Your central hub for platform-wide alerts and operational updates."
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        <div className="flex flex-row gap-2 items-center">
          <div className="hidden md:flex md:flex-col gap-0.5">
            <div className="flex items-center justify-end">
              <p className="text-[10px] font-medium text-[var(--color-dull-text)] text-left">
                Hello
              </p>
            </div>
            <p className="text-[14px] font-medium text-[var(--dark)] truncate">
              {user?.name || "New User"}
            </p>
          </div>

          {/* Avatar with dropdown - shows on both mobile and desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                <Avatar className="size-8 md:size-12 border-2">
                  {user?.profile_picture || user?.profile ? (
                    <AvatarImage
                      src={user.profile_picture || user?.profile}
                      alt="User Avatar"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="flex items-center justify-center bg-gray-100 text-gray-500">
                      <UserIcon className="w-5 h-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            {/* </DropdownMenuTrigger> */}
            {/* <DropdownMenu> */}
            <DropdownMenuContent className="w-48 mt-2 mr-2" align="end">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer p-3"
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4" />
                <span className="text-[var(--color-dull-text)]">
                  My Profile
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer p-3 "
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-[var(--color-dull-text)]">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="flex md:hidden w-[30px] h-[30px] border border-[var(--border-admin)] rounded-[6px] items-center justify-center shadow-md cursor-pointer"
            onClick={toggle}
            data-hamburger="true"
          >
            <RiMenu3Fill className="text-xl text-gray-600" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
