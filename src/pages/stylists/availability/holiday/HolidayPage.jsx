import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlidePanel from "@/components/feedback/SlidePanel";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import HolidayForm from "@/pages/my-store/availability/holiday/forms/HolidayForm";
import {
  getMyTimeOff,
  createMyTimeOff,
  deleteMyTimeOff,
} from "@/state/stylist/stylistMeService";


const HolidayPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyTimeOff();
      const list = res?.data ?? res ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load time off");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (formData) => {
    const date = new Date(formData.date).toISOString().split("T")[0];
    try {
      await createMyTimeOff({ from: date, to: date, reason: formData.occasion });
      toast.success("Time off added");
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add time off");
    }
  };

  const handleDelete = async () => {
    if (!deleteRow) return;
    try {
      await deleteMyTimeOff(deleteRow._id);
      toast.success("Time off removed");
      setDeleteRow(null);
      load();
    } catch {
      toast.error("Failed to remove time off");
    }
  };

  return (
    <div className="w-full border rounded-lg p-4">
      <div className="flex justify-between gap-4 mb-4 items-center">
        <div>
          <h2 className="text-lg font-semibold">My Time Off</h2>
          <p className="text-sm text-gray-500">
            Block dates when you're unavailable to take appointments.
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-primary1 hover:bg-primary1/90 text-white"
        >
          <Plus className="h-4 w-4" /> Add Time Off
        </Button>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : items.length ? (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(item.from).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(item.to).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.reason || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteRow(item)}
                        className="inline-flex items-center text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    No time off scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <SlidePanel
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Time Off"
        description="Block a date when you're unavailable."
        width="sm:max-w-md"
      >
        <HolidayForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </SlidePanel>

      <ConfirmDialog
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        onConfirm={handleDelete}
        title="Remove Time Off?"
        description="Are you sure you want to remove this time-off entry? This action cannot be undone."
        confirmLabel="Yes, Remove"
        cancelLabel="No, Keep it"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default HolidayPage;
