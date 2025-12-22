import {
  PiCirclesFourFill,
  PiCalendarBlank,
  PiShoppingCartLight,
} from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { BsShop } from "react-icons/bs";
import { PiChartBarBold, PiShoppingCart } from "react-icons/pi";
import Image from "next/image";

//  Left Sidebar items
export const leftSidebarItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <PiCirclesFourFill size={21} />,
  },
  {
    title: "Users",
    url: "/users",
    icon: <FaUsers size={21} />,
  },
  {
    title: "My Store",
    url: "/my-store",
    icon: <BsShop size={21} />,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: <PiCalendarBlank size={21} />,
  },
  {
    title: "My Ecom",
    url: "/my-ecom/order",
    icon: <PiShoppingCartLight size={21} />,
  },
];

//  Client Sidebar items
export const clientSidebarItems = (id) => [
  {
    title: "Overview",
    url: `/users/details/overview/${id}`,
    icon: <PiChartBarBold size={20} />,
  },
  {
    title: "Bookings",
    url: `/users/details/booking/${id}`,
    icon: <PiCalendarBlank size={20} />,
  },
  {
    title: "Product Orders",
    url: `/users/details/product-orders/${id}`,
    icon: <PiShoppingCart size={20} />,
  },
];

export const myStoreSidebarItems = [
  {
    title: "Store Profile",
    url: "/my-store",
    icon: <BsShop size={20} />,
  },
  {
    title: "Services",
    url: "/my-store/services",
    icon: (
      <Image
        src="/icons/store_services.svg"
        alt="stylist services"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Stylist",
    url: "/my-store/stylist",
    icon: (
      <Image
        src="/icons/store_stylist.svg"
        alt="stylist services"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Categories",
    url: "/my-store/categories",
    icon: (
      <Image
        src="/icons/myecom_categories.svg"
        alt="My store Categories"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Availability",
    url: "/my-store/availability",
    icon: (
      <Image
        src="/icons/store_availability.svg"
        alt="stylist services"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Portfolio",
    url: "/my-store/portfolio",
    icon: (
      <Image
        src="/icons/store_portfolio.svg"
        alt="stylist services"
        width={20}
        height={20}
      />
    ),
  }
];

export const myEcomSidebarItems = [
  {
    title: "Orders",
    url: "/my-ecom/order",
    icon: (
      <Image
        src="/icons/myecom_order.svg"
        alt="My Ecom Orders"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Products",
    url: "/my-ecom/product",
    icon: (
      <Image
        src="/icons/myecom_products.svg"
        alt="My Ecom Products"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Categories",
    url: "/my-ecom/categories",
    icon: (
      <Image
        src="/icons/myecom_categories.svg"
        alt="My Ecom Categories"
        width={20}
        height={20}
      />
    ),
  }
];

export const loctitianSidebarItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <PiCirclesFourFill size={21} />,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: (
      <Image
        src="/icons/stylist_appointment.svg"
        alt="stylist appointments"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Availability",
    url: "/my-store/availability",
    icon: (
      <Image
        src="/icons/stylist_availability.svg"
        alt="stylist appointments"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "My Reviews",
    url: "/stylists/review",
    icon: (
      <Image
        src="/icons/stylist_review.svg"
        alt="stylist appointments"
        width={20}
        height={20}
      />
    ),
  },
];


