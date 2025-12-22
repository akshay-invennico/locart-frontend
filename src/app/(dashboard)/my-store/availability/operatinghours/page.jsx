"use client";
import React, { useState, useEffect } from "react";
import { getStore, editStoreOperatingHours } from "@/state/store/storeService";
import { toast } from "sonner";

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

  const handleTimeChange = (id, type, value) => {
    setOperatingHours((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [type]: value } : item
      )
    );
  };

  const handleTimeBlur = (id) => {
    const dayData = operatingHours.find(item => item.id === id);
    if (dayData) {
      saveOperatingHours(dayData);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 mb-4">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Operating Hours</h2>
        </div>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 mb-4">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Operating Hours</h2>
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
              className={`grid grid-cols-4 gap-4 items-center py-4 border-b border-gray-50 last:border-0 ${!item.isOpen ? "opacity-60" : ""
                }`}
            >
              <div className="font-medium text-gray-700">{item.day}</div>

              <div>
                <input
                  type="text"
                  value={item.open}
                  disabled={!item.isOpen}
                  onChange={(e) => handleTimeChange(item.id, "open", e.target.value)}
                  onBlur={() => handleTimeBlur(item.id)}
                  className={`w-32 px-3 py-2 border rounded-md text-sm outline-none transition-colors
                    ${item.isOpen
                      ? "border-primary1 text-primary1 focus:ring-1 focus:ring-primary1"
                      : "border-gray-200 text-gray-400 bg-gray-50"
                    }`}
                />
              </div>

              <div>
                <input
                  type="text"
                  value={item.close}
                  disabled={!item.isOpen}
                  onChange={(e) => handleTimeChange(item.id, "close", e.target.value)}
                  onBlur={() => handleTimeBlur(item.id)}
                  className={`w-32 px-3 py-2 border rounded-md text-sm outline-none transition-colors
                    ${item.isOpen
                      ? "border-primary1 text-primary1 focus:ring-1 focus:ring-primary1"
                      : "border-gray-200 text-gray-400 bg-gray-50"
                    }`}
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
