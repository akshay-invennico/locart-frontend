import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import SlidePanel from "@/components/feedback/SlidePanel";
import {
  getMyAppointments,
  createMyAppointment,
  updateMyAppointmentStatus,
} from "@/state/stylist/stylistMeService";
import { AlertCircle } from "lucide-react";
import { useStylistApi } from "../_shared/useStylistApi";
import CreateAppointmentForm from "./forms/CreateAppointmentForm";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  upcoming: "bg-blue-50 text-blue-600",
  confirmed: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
  "no-show": "bg-gray-100 text-gray-500",
};

const StylistAppointmentsPage = () => {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { data, loading, error, run } = useStylistApi(
    () =>
      getMyAppointments({
        status: tab === "all" ? [] : [tab],
        search: search || undefined,
      }),
    [tab, search]
  );


  const appointments = data?.appointments || data || [];

  const handleCreate = async (values) => {
    try {
      await createMyAppointment(values);
      toast.success("Appointment created");
      setShowCreate(false);
      run().catch(() => { });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create appointment");
    }
  };

  const handleStatus = async (appt, next) => {
    try {
      await updateMyAppointmentStatus(appt._id, next);
      toast.success(`Marked ${next}`);
      run().catch(() => { });
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-sm text-gray-500">
            View and manage all the appointments assigned to you.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-primary1 hover:bg-primary1/90 text-white h-11"
        >
          <Plus className="h-4 w-4" /> Create Appointment
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === t.value
                  ? "bg-primary1 text-white"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SearchInput
          placeholder="Search by client or service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : appointments.length ? (
                appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {a.client?.name || a.client_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.service?.name || a.service_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.date ? new Date(a.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.start_time}
                      {a.end_time ? ` – ${a.end_time}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[a.status] || "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {a.status !== "completed" && a.status !== "cancelled" && (
                        <div className="inline-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-primary1 text-primary1"
                            onClick={() => handleStatus(a, "completed")}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-200 text-red-600"
                            onClick={() => handleStatus(a, "cancelled")}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <SlidePanel
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Appointment"
        description="Book a new appointment for a client."
      >
        <CreateAppointmentForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </SlidePanel>
    </div>
  );
};

export default StylistAppointmentsPage;
