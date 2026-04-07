import { useState } from "react";
import { AlertCircle, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getMyEarnings } from "@/state/stylist/stylistMeService";
import { useStylistApi } from "../_shared/useStylistApi";

const StatTile = ({ icon: Icon, label, value }) => (
  <Card>
    <CardContent className="p-5 flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary1/10 text-primary1">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="text-xl font-bold text-gray-900">{value ?? "—"}</p>
      </div>
    </CardContent>
  </Card>
);

const StylistEarningsPage = () => {
  const [range, setRange] = useState("month");
  const { data, loading, error } = useStylistApi(
    () => getMyEarnings({ range }),
    [range]
  );

  const stats = data || {};
  const transactions = stats.transactions || [];
  const fmt = (n) => (n != null ? `$${Number(n).toFixed(2)}` : "—");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
          <p className="text-sm text-gray-500">
            Your commission, tips, and payout history.
          </p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          {["week", "month", "year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                range === r ? "bg-primary1 text-white" : "text-gray-500"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile icon={DollarSign} label="Gross Earnings" value={loading ? "…" : fmt(stats.gross)} />
            <StatTile icon={TrendingUp} label="Tips" value={loading ? "…" : fmt(stats.tips)} />
            <StatTile icon={Wallet} label="Pending Payout" value={loading ? "…" : fmt(stats.pending_payout)} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">Recent Transactions</h2>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">Tip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td>
                  </tr>
                ) : transactions.length ? (
                  transactions.map((t) => (
                    <tr key={t._id}>
                      <td className="px-4 py-3 text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{t.client_name}</td>
                      <td className="px-4 py-3 text-gray-600">{t.service_name}</td>
                      <td className="px-4 py-3 text-gray-800">{fmt(t.amount)}</td>
                      <td className="px-4 py-3 text-gray-800">{fmt(t.commission)}</td>
                      <td className="px-4 py-3 text-gray-800">{fmt(t.tip)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StylistEarningsPage;
