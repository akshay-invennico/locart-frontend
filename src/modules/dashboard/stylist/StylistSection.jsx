import { stylistColumns } from "./stylistColumn";
import GridCommonComponent from "@/components/grid/gridCommonComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchTopPerformingStylist } from "@/state/dashboard/dashboardSlice";
import DataDebugger from "@/components/grid/DataDebugger";
import { StylistData } from "./stylistData";

export default function StylistSection({stylists}) {
  // const dispatch = useDispatch();
  // const { stylists, loading } = useSelector((state) => state.dashboard);

  // useEffect(() => {
  //   dispatch(fetchTopPerformingStylist());
  // }, [dispatch]);

  const options = {
    select: false,
    order: true,
    sortable: true,
  };

  return (
    <div className="w-full border rounded-lg p-4">
      <div className="mt-2">
        <h2 className="text-lg font-semibold mb-2">Top Performing Stylist</h2>
        {/* <DataDebugger  data={StylistData} title="Stylist Data" /> */}
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