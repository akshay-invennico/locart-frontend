import { useState } from "react";
import { Plus } from "lucide-react";
import { SlidePanel } from "@/components/feedback";
import TopPoints from "./TopPoints";
import BadgeSection from "./BadgeSection";
import AddBadgeForm from "./forms/AddBadgeForm";
import AddPointsForm from "./forms/AddPointsForm";

export default function UserLoyaltyRewardsPage() {
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [pointsOpen, setPointsOpen] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => setBadgeOpen(true)}
          className="inline-flex items-center gap-2 border border-[#02C8DE] text-[#02C8DE] px-4 py-2 rounded-md hover:bg-blue-50"
        >
          <Plus className="w-4 h-4" />
          Add Badge
        </button>

        <button
          onClick={() => setPointsOpen(true)}
          className="inline-flex items-center gap-2 bg-[#02C8DE] text-white px-4 py-2 rounded-md hover:bg-[#02C8DE]/90"
        >
          <Plus className="w-4 h-4" />
          Add Points
        </button>
      </div>

      <TopPoints />
      <BadgeSection />

      <SlidePanel
        open={badgeOpen}
        onClose={() => setBadgeOpen(false)}
        title="Assign Badge to Client"
        description="Use this to manually assign badge to the client's account."
        width="sm:max-w-md"
      >
        <AddBadgeForm
          onSubmit={(values) => {
            console.log("Badge Added", values);
            setBadgeOpen(false);
          }}
          onCancel={() => setBadgeOpen(false)}
        />
      </SlidePanel>

      <SlidePanel
        open={pointsOpen}
        onClose={() => setPointsOpen(false)}
        title="Add Loyalty Points"
        description="Use this to manually credit points to the Client's account."
        width="sm:max-w-md"
      >
        <AddPointsForm
          onSubmit={(values) => {
            console.log("Points Added", values);
            setPointsOpen(false);
          }}
          onCancel={() => setPointsOpen(false)}
        />
      </SlidePanel>
    </div>
  );
}
