import React, { useState, useEffect } from "react";
import { updateLoyaltySettings, getLoyaltySettings } from "@/state/loyalty/loyaltyService";
import { toast } from "sonner";

const PointsSettings = () => {
  const [pointValue, setPointValue] = useState("0.10");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getLoyaltySettings();
        if (response.success && response.data) {
          setPointValue(response.data.pointValue);
        }
      } catch (error) {
        console.error("Failed to fetch loyalty settings", error);
        toast.error("Failed to fetch current settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await updateLoyaltySettings({ pointValue: parseFloat(pointValue) });
      if (response.success) {
        toast.success("Loyalty settings updated successfully");
      }
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error("Failed to update loyalty settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Points Settings
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Configure how much one LOC point is worth in dollars. This value will
          be used when customers redeem their points.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label
                htmlFor="pointValue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dollar value per 1 LOC point
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  id="pointValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pointValue}
                  onChange={(e) => setPointValue(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary1 focus:border-primary1"
                  placeholder="0.10"
                  required
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="font-medium text-gray-800 mb-1">Preview</div>
              <div>
                1 LOC Point ={" "}
                <span className="font-semibold text-gray-900">
                  ${Number(pointValue || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setPointValue("0.10")}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-primary1 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PointsSettings;
