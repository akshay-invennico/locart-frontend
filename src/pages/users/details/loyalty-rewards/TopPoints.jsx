import GridCommonComponent from "@/components/grid/gridCommonComponent";

const pointsColumns = [
  {
    key: "points",
    title: "Points",
    component: {
      type: "phone",
      style: { color: "#00A78E" },
      option: { sign: "", position: "start" },
    },
  },
  {
    key: "date_time",
    title: "Date",
    component: { type: "date", options: { format: "MM dd yyyy" } },
  },
  {
    key: "action",
    title: "Action Type",
    sortable: true,
    component: { type: "", style: { text: "text-gray-500" } },
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
    component: { type: "", style: { text: "text-gray-500" } },
  },
];

const pointsData = [
  { id: 1, points: "+120 pts", date_time: "2025-08-06T09:15:00Z", action: "Booking Completed", description: "$1,200 service with Aaliyah Johnson" },
  { id: 2, points: "-120 pts", date_time: "2025-08-06T09:15:00Z", action: "Points Redeemed", description: "Used points to get $10 off" },
  { id: 3, points: "-150 pts", date_time: "2025-08-06T09:15:00Z", action: "Points Redeemed", description: "Used points to get $10 off" },
  { id: 4, points: "+180 pts", date_time: "2025-08-06T09:15:00Z", action: "Referral Bonus", description: "Referred new Client: Jasmine Reed" },
  { id: 5, points: "-210 pts", date_time: "2025-08-06T09:15:00Z", action: "Booking Completed", description: "$1,000 appointment with DeShawn Miller" },
];

const gridOptions = { select: false, order: false, sortable: true };

export default function TopPoints() {
  return (
    <div className="w-full border rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2 mt-2">Points Activity Table</h2>
      <GridCommonComponent
        data={pointsData}
        columns={pointsColumns}
        options={gridOptions}
        theme={{ border: "border-gray-300", header: { bg: "bg-gray-100" } }}
      />
    </div>
  );
}
