import {
  PiCirclesFourFill,
  PiCalendarBlank,
  PiShoppingCartLight,
} from "react-icons/pi";
import { FaGift, FaUsers } from "react-icons/fa";
import { BsShop } from "react-icons/bs";
import { PiChartBarBold, PiShoppingCart } from "react-icons/pi";
import { LuTruck, LuWallet, LuRotateCcw } from "react-icons/lu";
import { MdOutlineLocalOffer } from "react-icons/md";

//  Left Sidebar items
export const leftSidebarItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <PiCirclesFourFill size={21} />,
  },
  {
    title: "Clients",
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
    matchPrefixes: ["/my-ecom"],
    icon: <PiShoppingCartLight size={21} />,
  },
  {
    title: "Payment & Payouts",
    url: "/payment-and-payouts",
    icon: <LuWallet size={21} />,
  },
  {
    title: "Incentive Programs",
    url: "/loyalty-rewards",
    icon: <FaGift size={21} />,
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
      <img
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
      <img
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
      <img
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
      <img
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
      <img
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
      <img
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
      <img
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
      <img
        src="/icons/myecom_categories.svg"
        alt="My Ecom Categories"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Vendors",
    url: "/my-ecom/vendor",
    icon: <LuTruck size={20} />,
  },
  {
    title: "Offers",
    url: "/my-ecom/offer",
    icon: <MdOutlineLocalOffer size={20} />,
  }
];

export const paymentSidebarItems = [
  {
    title: "All Transactions",
    url: "/payment-and-payouts",
    icon: <LuWallet size={20} />,
  },
  {
    title: "Refunds",
    url: "/payment-and-payouts/refunds",
    icon: <LuRotateCcw size={20} />,
  },
];

export const loctitianSidebarItems = [
  {
    title: "Dashboard",
    url: "/stylists/dashboard",
    icon: <PiCirclesFourFill size={21} />,
  },
  {
    title: "Appointments",
    url: "/stylists/appointments",
    icon: (
      <img
        src="/icons/stylist_appointment.svg"
        alt="stylist appointments"
        width={20}
        height={20}
      />
    ),
  },
  {
    title: "Availability",
    url: "/stylists/availability",
    icon: (
      <img
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
      <img
        src="/icons/stylist_review.svg"
        alt="stylist appointments"
        width={20}
        height={20}
      />
    ),
  },
];


