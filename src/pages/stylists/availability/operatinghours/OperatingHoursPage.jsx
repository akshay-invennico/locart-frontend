import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  getMyAvailability,
  updateMyAvailability,
} from "@/state/stylist/stylistMeService";
import { AlertCircle } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TimePickerPopover = ({ value, onChange, disabled }) => {
  const [isAm, setIsAm] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && value) setIsAm(value.toLowerCase().includes("am"));
  }, [isOpen, value]);

  const generateTimeSlots = () => {
    const period = isAm ? "AM" : "PM";
    const slots = [`12:00 ${period}`, `12:30 ${period}`];
    for (let i = 1; i <= 11; i++) {
      slots.push(`${i}:00 ${period}`);
      slots.push(`${i}:30 ${period}`);
    }
    return slots;
  };

  if (disabled) {
    return (
      <div className="w-32 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-400 bg-gray-50 cursor-not-allowed flex items-center h-[38px]">
        {value || "--:--"}
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-32 px-3 py-2 border border-gray-200 hover:border-primary1 rounded-md text-sm cursor-pointer transition-colors flex items-center h-[38px] text-gray-700">
          {value || "--:--"}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="start">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-700">Time Slot</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                onClick={() => setIsAm(p === "AM")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  (p === "AM") === isAm
                    ? "bg-white text-primary1 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {generateTimeSlots().map((time) => {
            const isSelected = value === time;
            return (
              <button
                key={time}
                onClick={() => {
                  onChange(time);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-center py-2 px-1 text-xs rounded-md border transition-all ${
                  isSelected
                    ? "border-primary1 text-primary1 bg-primary1/5 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-primary1 hover:text-primary1"
                }`}
              >
                {time.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const OperatingHoursPage = () => {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyAvailability();
        const payload = res?.data ?? res;
        const list = payload?.workingHours || [];
        const seeded = DAYS.map((day) => {
          const match = list.find((h) => h.day === day);
          return (
            match || { day, open: "09:00 AM", close: "05:00 PM", isOpen: false }
          );
        });
        setHours(seeded);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load availability");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next) => {
    try {
      await updateMyAvailability({ workingHours: next });
      toast.success("Availability updated");
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleToggle = (day) => {
    setHours((prev) => {
      const next = prev.map((h) =>
        h.day === day ? { ...h, isOpen: !h.isOpen } : h
      );
      persist(next);
      return next;
    });
  };

  const handleTimeUpdate = (day, type, value) => {
    setHours((prev) => {
      const next = prev.map((h) =>
        h.day === day ? { ...h, [type]: value } : h
      );
      persist(next);
      return next;
    });
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 mb-4">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">My Working Hours</h2>
        <p className="text-sm text-gray-500">
          Set the days and times you're available to take appointments.
        </p>
      </div>

      <div className="p-6">
        {error ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4 text-sm font-semibold text-gray-600">
              <div>Day</div>
              <div>Open Time</div>
              <div>Close Time</div>
              <div className="text-right pr-4">Available</div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400 py-6 text-center">Loading…</p>
            ) : (
              <div className="space-y-4">
                {hours.map((item) => (
                  <div
                    key={item.day}
                    className={`grid grid-cols-4 gap-4 items-center py-4 border-b border-[#E4E4E6] last:border-0 ${
                      !item.isOpen ? "opacity-60" : ""
                    }`}
                  >
                    <div className="font-medium text-gray-700">{item.day}</div>
                    <TimePickerPopover
                      value={item.open}
                      onChange={(v) => handleTimeUpdate(item.day, "open", v)}
                      disabled={!item.isOpen}
                    />
                    <TimePickerPopover
                      value={item.close}
                      onChange={(v) => handleTimeUpdate(item.day, "close", v)}
                      disabled={!item.isOpen}
                    />
                    <div className="flex justify-end pr-2">
                      <Switch
                        checked={item.isOpen}
                        onCheckedChange={() => handleToggle(item.day)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OperatingHoursPage;
