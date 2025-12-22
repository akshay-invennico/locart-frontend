import { activityColumns } from "./activityColumn";
import GridCommonComponent from "@/components/grid/gridCommonComponent";

export default function ActivitySection({ activities }) {
  const options = {
    select: false,
    order: false,
    sortable: true,
  };

  return (
    <div className="border rounded-lg p-4 h-full flex flex-col overflow-hidden">
      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll">
        <GridCommonComponent
          data={activities}
          columns={activityColumns}
          options={options}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
            hideHeader: true,
          }}
        />
      </div>
    </div>
  );
}
