import React, { useState, useEffect } from "react";
import { getStore, editStoreOperatingHours } from "@/state/store/storeService";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TimePickerPopover = ({ value, onChange, disabled }) => {
  const [isAm, setIsAm] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (value) {
        setIsAm(value.toLowerCase().includes("am"));
      } else {
        setIsAm(true);
      }
    }
  }, [isOpen, value]);

  const generateTimeSlots = () => {
    const slots = [];
    const period = isAm ? "AM" : "PM";

    slots.push(`12:00 ${period}`);
    slots.push(`12:30 ${period}`);

    for (let i = 1; i <= 11; i++) {
      slots.push(`${i}:00 ${period}`);
      slots.push(`${i}:30 ${period}`);
    }
    return slots;
  };

  const handleSelect = (time) => {
    onChange(time);
    setIsOpen(false);
  };

  const timeSlots = generateTimeSlots();

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
        <div
          className="w-32 px-3 py-2 border border-gray-200 hover:border-primary1 rounded-md text-sm cursor-pointer transition-colors flex items-center h-[38px] text-gray-700"
        >
          {value || "--:--"}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="start">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-700">Time Slot</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsAm(true)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${isAm ? "bg-white text-primary1 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              AM
            </button>
            <button
              onClick={() => setIsAm(false)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!isAm ? "bg-white text-primary1 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              PM
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {timeSlots.map((time) => {
            const isSelected = value === time;
            const displayTime = time.split(' ')[0];

            return (
              <button
                key={time}
                onClick={() => handleSelect(time)}
                className={`flex items-center justify-center py-2 px-1 text-xs rounded-md border transition-all ${isSelected
                  ? "border-primary1 text-primary1 bg-primary1/5 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-primary1 hover:text-primary1"
                  }`}
              >
                {displayTime}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const OperatingHoursPage = () => {
  const [operatingHours, setOperatingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await getStore();
        if (response.success && response.data) {
          setStoreId(response.data._id);

          const mappedHours = response.data.operatingHours?.map((item, index) => ({
            id: index + 1,
            day: item.day,
            open: item.open,
            close: item.close,
            isOpen: item.isOpen,
          })) || [];

          setOperatingHours(mappedHours);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
        toast.error("Failed to load operating hours");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const saveOperatingHours = async (dayData) => {
    if (!storeId) {
      toast.error("Store ID not found");
      return;
    }

    try {
      const { id, ...apiPayload } = dayData;
      const response = await editStoreOperatingHours(storeId, apiPayload);

      if (response.success) {
        toast.success("Operating hours updated successfully");
      }
    } catch (error) {
      console.error("Error updating operating hours:", error);
      toast.error("Failed to update operating hours");
    }
  };

  const handleToggle = (id) => {
    setOperatingHours((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, isOpen: !item.isOpen };
          saveOperatingHours(updatedItem);
          return updatedItem;
        }
        return item;
      });

      return updated;
    });
  };

  const handleTimeUpdate = (id, type, value) => {
    setOperatingHours((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [type]: value };
          saveOperatingHours(updatedItem);
          return updatedItem;
        }
        return item;
      });
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 mb-4">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold mb-2">Operating Hours</h2>
        </div>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 mb-4">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Operating Hours</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-4 text-sm font-semibold text-gray-600">
          <div>Day</div>
          <div>Open Time</div>
          <div>Close Time</div>
          <div className="text-right pr-4">Action</div>
        </div>

        <div className="space-y-4">
          {operatingHours.map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-4 gap-4 items-center py-4 border-b border-[#E4E4E6] last:border-0 ${!item.isOpen ? "opacity-60" : ""
                }`}
            >
              <div className="font-medium text-gray-700">{item.day}</div>

              <div>
                <TimePickerPopover
                  value={item.open}
                  onChange={(time) => handleTimeUpdate(item.id, 'open', time)}
                  disabled={!item.isOpen}
                />
              </div>

              <div>
                <TimePickerPopover
                  value={item.close}
                  onChange={(time) => handleTimeUpdate(item.id, 'close', time)}
                  disabled={!item.isOpen}
                />
              </div>

              <div className="flex justify-end pr-2">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary1 focus:ring-offset-2 ${item.isOpen ? "bg-primary1" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isOpen ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatingHoursPage;
