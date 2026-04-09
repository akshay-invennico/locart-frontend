import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { IoCalendarClear } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMyDashboard } from "@/state/stylist/stylistMeService";
import { useStylistApi } from "../_shared/useStylistApi";
import { Calendar } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildYears() {
  const cur = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => String(cur - 2 + i));
}

const CARD_THEMES = [
  {
    bg: "#3B82F6",
    badge: "#4CAF50",
  },
  {
    bg: "#EEA612",
    badge: "#4CAF50",
  },
  {
    bg: "#7C3AED",
    badge: "#4CAF50",
  },
];

const StatCard = ({ label, value, hint, theme, loading }) => (
  <div
    className="relative rounded-[10px] p-5 flex flex-col gap-2 overflow-hidden"
    style={{ background: theme.bg, minHeight: 110 }}
  >
    <div
      className="absolute top-4 right-4 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
      style={{ background: "rgba(255,255,255,0.25)" }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1L5 9M5 1L2 4M5 1L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      8.06%
    </div>

    <p className="text-white text-base font-medium">{label}</p>

    <div className="flex items-center gap-3">
      <Calendar className="text-white" />
      <p className="text-white text-[32px] font-bold leading-none">
        {loading ? (
          <span className="inline-block w-16 h-8 bg-white/20 rounded animate-pulse" />
        ) : (
          value ?? "—"
        )}
      </p>
    </div>

    {hint && (
      <p className="text-white text-[12px]">{hint}</p>
    )}
  </div>
);

const BookingOverviewChart = ({ monthlyData, loading }) => {
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const years = useMemo(buildYears, []);

  const chartData = useMemo(() => {
    const base = MONTHS.map((m) => ({ label: m, bookingValue: 0 }));
    if (!monthlyData?.length) return base;
    monthlyData.forEach((item) => {
      const idx = MONTHS.findIndex(
        (m) => m.toLowerCase() === item.label?.toString().toLowerCase().slice(0, 3)
      );
      if (idx !== -1) base[idx].bookingValue = item.bookingValue ?? item.count ?? 0;
    });
    return base;
  }, [monthlyData]);

  return (
    <div className="border border-(--border-admin) rounded-[8px] h-full flex flex-col">
      <div className="border-b border-(--border-admin) px-5 py-3 flex items-center justify-between">
        <p className="text-black text-[16px] font-semibold">Booking Overview</p>
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-medium text-gray-700">{selectedYear}</p>
          <Popover>
            <PopoverTrigger>
              <IoCalendarClear size={18} className="cursor-pointer text-gray-600" />
            </PopoverTrigger>
            <PopoverContent
              className="border w-[150px] border-(--border-admin) rounded-[8px] p-3"
              align="end"
              sideOffset={8}
            >
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex items-center justify-between cursor-pointer px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors ${year === selectedYear
                    ? "text-(--color-primary1) bg-[#E5FCFF]"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {year}
                  {year === selectedYear && (
                    <IoIosCheckmarkCircle fill="var(--color-primary1)" size={16} />
                  )}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-2">
        {loading ? (
          <div className="h-[240px] flex items-center justify-center">
            <div className="w-full h-full flex items-end gap-2 px-2">
              {MONTHS.map((m) => (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gray-100 rounded animate-pulse"
                    style={{ height: `${40 + Math.random() * 120}px` }}
                  />
                  <span className="text-[10px] text-gray-400">{m}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barSize={18}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "#888" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#888" }}
                width={35}
              />
              <Bar
                dataKey="bookingValue"
                fill="var(--color-secondary1)"
                radius={[6, 6, 6, 6]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const TodaysPieChart = ({ schedule, loading }) => {
  const chartData = useMemo(() => {
    const pending = schedule?.filter(
      (s) => s.status === "upcoming" || s.status === "pending" || !s.status
    ).length ?? 0;
    const completed = schedule?.filter((s) => s.status === "completed").length ?? 0;

    return [
      { name: "Pending", value: pending, color: "#00A78E" },
      { name: "Completed", value: completed, color: "#02C8DE" },
    ];
  }, [schedule]);

  const noData = chartData.every((d) => d.value === 0);

  return (
    <div className="border border-(--border-admin) rounded-[8px] h-full flex flex-col">
      <div className="border-b border-(--border-admin) px-5 py-3">
        <p className="text-black text-[16px] font-semibold">
          Today&apos;s Appointment Overview
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6 px-4">
        {loading ? (
          <div className="w-40 h-40 rounded-full bg-gray-100 animate-pulse" />
        ) : noData ? (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div
              className="w-36 h-36 rounded-full border-16 border-gray-100"
              style={{ borderStyle: "dashed" }}
            />
            <p className="text-sm">No appointments today</p>
          </div>
        ) : (
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={100}
                startAngle={90}
                endAngle={-270}
                strokeWidth={4}
                stroke="#ffffff"
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    cornerRadius={i === 0 ? 5 : 0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        {!loading && (
          <div className="flex items-center gap-6 mt-3">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[13px] font-medium text-gray-700">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ACTIVITY_ICON_TYPES = {
  booking_completed: {
    bg: "#3D52D5",
    render: (initials) => (
      <span className="text-[11px] font-bold text-white">{initials}</span>
    ),
  },
  booking_cancelled: {
    bg: "#FFF0F0",
    render: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#E53935" strokeWidth="1.5" />
        <path d="M5 5l6 6M11 5l-6 6" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  review: {
    bg: "#FFFBEA",
    render: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1l1.8 3.6L14 5.2l-3 2.9.7 4.1L8 10.1l-3.7 2.1.7-4.1-3-2.9 4.2-.6L8 1z"
          fill="#F59E0B"
        />
      </svg>
    ),
  },
  availability: {
    bg: "#EFF6FF",
    render: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="2" stroke="#3B82F6" strokeWidth="1.3" />
        <path d="M5 1v4M11 1v4M1 7h14" stroke="#3B82F6" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  booking_confirmed: {
    bg: "#EFF6FF",
    render: () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="2" stroke="#3B82F6" strokeWidth="1.3" />
        <path d="M5 1v4M11 1v4M1 7h14" stroke="#3B82F6" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
};

function getActivityIcon(activity) {
  const t = activity.type || "booking_confirmed";
  const conf = ACTIVITY_ICON_TYPES[t] || ACTIVITY_ICON_TYPES.booking_confirmed;
  const initials = activity.client_name
    ? activity.client_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ background: t === "booking_completed" ? "#3D52D5" : conf.bg }}
    >
      {conf.render(initials)}
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

const FALLBACK_ACTIVITIES = [];

const RecentActivity = ({ activities, loading }) => {
  const items = activities?.length ? activities : FALLBACK_ACTIVITIES;

  return (
    <div className="bg-white rounded-[8px] border border-(--border-admin)">
      <div className="px-5 py-4 border-b border-(--border-admin)">
        <p className="text-[16px] font-semibold text-gray-900">Recent Activity</p>
      </div>
      <div className="divide-y divide-gray-50">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/4" />
              </div>
            </div>
          ))
          : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Calendar className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-sm font-medium">No recent activity</p>
              <p className="text-xs mt-1">Your latest actions will appear here.</p>
            </div>
          ) : items.map((item) => (
            <div key={item.id || item._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              {getActivityIcon(item)}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800 leading-snug truncate">
                  {item.message}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {item.time ? timeAgo(item.time) : `${item.minsAgo}m ago`}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const StylistDashboardPage = () => {
  const { data, loading, error } = useStylistApi(() => getMyDashboard("month"), []);
  const stats = data || {};

  const statCards = [
    {
      label: "Total Appointments",
      value: stats.totalAppointments ?? stats.appointmentsCount ?? "—",
      hint: "Total Appointments booked",
      theme: CARD_THEMES[0],
    },
    {
      label: "Upcoming Appointments",
      value: stats.upcomingCount ?? "—",
      hint: "Upcoming Appointments this week",
      theme: CARD_THEMES[1],
    },
    {
      label: "Today's Appointments",
      value: stats.todayCount ?? stats.todaysSchedule?.length ?? "—",
      hint: "Appointments scheduled for today",
      theme: CARD_THEMES[2],
    },
  ];

  return (
    <div className="space-y-5 max-w-[1400px]">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="#E53935" />
            <path d="M7 4v3.5M7 9.5v.5" stroke="#E53935" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>
            Unable to load dashboard data
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4" style={{ minHeight: 380 }}>
        <BookingOverviewChart
          monthlyData={stats.bookingOverview ?? stats.monthlyData ?? []}
          loading={loading}
        />
        <TodaysPieChart
          schedule={stats.todaysSchedule}
          loading={loading}
        />
      </div>

      <RecentActivity
        activities={stats.recentActivity ?? []}
        loading={loading}
      />
    </div>
  );
};

export default StylistDashboardPage;
