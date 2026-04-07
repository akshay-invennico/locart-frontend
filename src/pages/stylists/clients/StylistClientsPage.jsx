import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { getMyClients } from "@/state/stylist/stylistMeService";
import { AlertCircle } from "lucide-react";
import { useStylistApi } from "../_shared/useStylistApi";

const StylistClientsPage = () => {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useStylistApi(
    () => getMyClients({ search: search || undefined }),
    [search]
  );
  const clients = data?.clients || data || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
          <p className="text-sm text-gray-500">
            All clients who have ever booked an appointment with you.
          </p>
        </div>
        <SearchInput
          placeholder="Search clients…"
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Bookings</th>
                <th className="px-4 py-3">Last Visit</th>
                <th className="px-4 py-3">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : clients.length ? (
                clients.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.bookings_count ?? 0}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.last_visit ? new Date(c.last_visit).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {c.total_spent != null ? `$${Number(c.total_spent).toFixed(2)}` : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StylistClientsPage;
