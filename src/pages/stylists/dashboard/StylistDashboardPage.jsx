import { useState } from "react";
import { Calendar, Clock, Star, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyDashboard } from "@/state/stylist/stylistMeService";
import { useStylistApi } from "../_shared/useStylistApi";

const StatCard = ({ icon: Icon, label, value, hint, tone = "primary1" }) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value ?? "—"}</p>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${tone}/10 text-${tone}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const StylistDashboardPage = () => {
  const [range, setRange] = useState("today");
  const { data, loading, error } = useStylistApi(
    () => getMyDashboard(range),
    [range]
  );

  const stats = data || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500">
            Your bookings, earnings, and performance at a glance.
          </p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          {["today", "week", "month"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${range === r
                  ? "bg-primary1 text-white"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              label="Appointments"
              value={loading ? "…" : stats.appointmentsCount}
              hint={`for this ${range}`}
            />
            <StatCard
              icon={Clock}
              label="Upcoming"
              value={loading ? "…" : stats.upcomingCount}
              hint="next 7 days"
            />
            <StatCard
              icon={DollarSign}
              label="Earnings"
              value={
                loading
                  ? "…"
                  : stats.earnings != null
                    ? `$${Number(stats.earnings).toFixed(2)}`
                    : null
              }
              hint={`for this ${range}`}
            />
            <StatCard
              icon={Star}
              label="Average Rating"
              value={loading ? "…" : stats.averageRating}
              hint={`${stats.totalReviews ?? 0} reviews`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : stats.todaysSchedule?.length ? (
                  <ul className="divide-y divide-gray-100">
                    {stats.todaysSchedule.map((s) => (
                      <li
                        key={s._id}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {s.client_name}
                          </p>
                          <p className="text-xs text-gray-500">{s.service_name}</p>
                        </div>
                        <span className="text-xs font-medium text-primary1">
                          {s.start_time}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No appointments scheduled.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary1" /> Top Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : stats.topServices?.length ? (
                  <ul className="space-y-3">
                    {stats.topServices.map((s) => (
                      <li
                        key={s._id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">{s.name}</span>
                        <span className="font-medium text-gray-900">
                          {s.bookings}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No data yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default StylistDashboardPage;
