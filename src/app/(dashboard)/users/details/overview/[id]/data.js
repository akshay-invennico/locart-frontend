import { CalendarDays, ShoppingCart, DollarSign } from "lucide-react";

export const fallbackStats = {
  totalBookings: {
    title: "Total Bookings",
    value: 20,
    subText: "01 New Booking this month",
    bgColor: "bg-[#02C8DE]",
    icon: CalendarDays,
  },
  productOrders: {
    title: "Product Orders",
    value: 154,
    subText: "12 New Orders",
    bgColor: "bg-[#00A78E]",
    icon: ShoppingCart,
  },
  totalSpent: {
    title: "Total Spent",
    value: "$4250",
    subText: "This Month",
    bgColor: "bg-[#7C3AED]",
    icon: DollarSign,
  },
};
