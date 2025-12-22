import {
  CalendarDays,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

export const stats = [
  {
    id: 1,
    title: "Total Bookings",
    value: 20,
    subText: "01 New Booking this month",
    percentage: "8.06%",
    trend: "up",
    bgColor: "bg-[#02C8DE]",
    icon: CalendarDays,
  },
  {
    id: 2,
    title: "Total Customers",
    value: 154,
    subText: "12 New Customers",
    percentage: "4.2%",
    trend: "up",
    bgColor: "bg-[#00A78E]",
    icon: ShoppingCart,
  },
  {
    id: 4,
    title: "Total Revenue",
    value: "4250",
    subText: "This Month",
    percentage: "12.3%",
    trend: "up",
    bgColor: "bg-[#7C3AED]",
    icon: DollarSign,
  },
];
