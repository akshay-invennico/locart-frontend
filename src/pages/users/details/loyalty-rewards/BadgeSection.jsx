import GridCommonComponent from "@/components/grid/gridCommonComponent";

const badgeColumns = [
  {
    key: "badge_name",
    title: "Badge Name",
    sortable: true,
    component: { type: "", style: { text: "text-gray-900" } },
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
    component: { type: "", style: { text: "text-gray-500" } },
  },
  {
    key: "date_time",
    title: "Date & Time",
    component: { type: "date", options: { format: "MM dd yyyy" } },
  },
];

const badgeData = [
  { id: 1, badge_name: "First Booking", description: "Completed first appointment", date_time: "2025-06-18T13:30:00Z" },
  { id: 2, badge_name: "Referral Pro", description: "Referred 3+ new clients", date_time: "2025-06-19T13:30:00Z" },
  { id: 3, badge_name: "Booking Streak", description: "5 consecutive bookings in 60 days", date_time: "2025-06-20T13:30:00Z" },
];

const gridOptions = { select: false, order: false, sortable: true };

export default function BadgeSection() {
  return (
    <div className="w-full border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2 mt-2">Badge & Achievement</h2>
      <GridCommonComponent
        data={badgeData}
        columns={badgeColumns}
        options={gridOptions}
        theme={{ border: "border-gray-300", header: { bg: "bg-gray-100" } }}
      />
    </div>
  );
}
