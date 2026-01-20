import { stylistColumns } from "./stylistColumn";
import GridCommonComponent from "@/components/grid/gridCommonComponent";

export default function StylistSection({ stylists }) {
  const options = {
    select: false,
    order: true,
    sortable: true,
  };

  return (
    <div className="w-full border rounded-lg p-4">
      <div className="mt-2">
        <h2 className="text-lg font-semibold mb-2">Top Performing Stylist</h2>
        <GridCommonComponent
          data={stylists}
          columns={stylistColumns}
          options={options}
          theme={{
            border: "border-gray-300",
            header: { bg: "bg-gray-100" },
          }}
        />
      </div>
    </div>
  );
}