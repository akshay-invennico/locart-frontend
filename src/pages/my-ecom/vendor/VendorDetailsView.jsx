import React from "react";

const InfoItem = ({ label, value, valueClassName = "" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${valueClassName}`}>{value || "N/A"}</p>
  </div>
);

const VendorDetailsView = ({ vendor }) => {
  if (!vendor) return <div className="p-4">No vendor data available</div>;

  const fallbackImg = "/noimage.png";
  const profileImg = vendor.profile || fallbackImg;
  const status = vendor.isActive ? "Active" : "Inactive";

  return (
    <div className="space-y-6 flex flex-col pt-3 pb-8">
      <div>
        <h3 className="text-lg font-bold mb-1">Vendor Details</h3>
        <p className="text-sm text-gray-500">
          View complete vendor information and contact details.
        </p>
        <hr className="mt-3 border-gray-200" />
      </div>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
          <img
            src={profileImg}
            alt={vendor.name || "Vendor"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
          />
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-900">{vendor.name}</h4>
          <p className="text-sm text-gray-500">{vendor.company || "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InfoItem label="Full Name" value={vendor.name} />
        <InfoItem label="Email" value={vendor.email} />
        <InfoItem label="Phone" value={vendor.phone} />
        <InfoItem label="Company" value={vendor.company} />
        <InfoItem
          label="Status"
          value={status}
          valueClassName={vendor.isActive ? "text-[#02C8DE]" : "text-red-500"}
        />
        <InfoItem label="Address" value={vendor.address} />
      </div>

      {vendor.notes && (
        <>
          <hr className="border-gray-200" />
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-2">Notes</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {vendor.notes}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDetailsView;
