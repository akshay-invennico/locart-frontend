import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchStylistsById } from "@/state/stylist/stylistSlice";
import Spinner from "@/components/common/Spinner";

const InfoItem = ({ label, value, valueStyle }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm font-medium" style={valueStyle}>{value || "N/A"}</p>
  </div>
);

const StylistDetailsView = ({ row }) => {
  const dispatch = useDispatch();
  const [stylist, setStylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!row?._id) return;
      try {
        const result = await dispatch(fetchStylistsById(row._id)).unwrap();
        if (mounted) setStylist(result?.data?.stylist || result?.stylist || {});
      } catch (err) {
        console.error("Error loading stylist:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [row?._id, dispatch]);

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Spinner /></div>;
  if (!stylist) return <div>Error loading stylist details</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1">Stylist Details</h3>
        <p className="text-sm text-gray-500">View and manage stylist details.</p>
      </div>

      {/* Profile Card */}
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <img
          src={stylist.profilePhoto || "/noimage.png"}
          alt={stylist.fullName}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h4 className="font-semibold">{stylist.fullName || "N/A"}</h4>
          <p className="text-sm text-gray-500">{stylist.email || "N/A"}</p>
          <p className="text-sm text-gray-500">{stylist.phone || "N/A"}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Joined On" value={stylist.createdAt ? new Date(stylist.createdAt).toLocaleDateString() : undefined} />
        <InfoItem label="Status" value={stylist.status} valueStyle={{ color: "#02C8DE" }} />
        <InfoItem label="Total Bookings" value={stylist.totalBookings || 0} />
        <InfoItem label="Total Earnings" value={stylist.totalEarnings ? `$${stylist.totalEarnings}` : "$0"} />
        <InfoItem label="Rating" value={stylist.rating || "N/A"} />
        <InfoItem label="Experience" value={stylist.experience_years ? `${stylist.experience_years} years` : "N/A"} />
        <InfoItem label="Nickname" value={stylist.nickname} />
        <InfoItem label="Specialization" value={stylist.specialization} />
      </div>

      {/* Services */}
      {stylist.services?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Linked Services</h4>
          <div className="flex flex-wrap gap-2">
            {stylist.services.map((s, i) => (
              <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {s.name || s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      {stylist.about && (
        <div>
          <h4 className="font-semibold mb-1">About</h4>
          <p className="text-sm text-gray-600">{stylist.about}</p>
        </div>
      )}
    </div>
  );
};

export default StylistDetailsView;
