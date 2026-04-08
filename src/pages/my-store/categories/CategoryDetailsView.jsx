const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);

const CategoryDetailsView = ({ category, onClose }) => {
  if (!category) return <p className="p-4">No category data</p>;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-bold mb-1">Category Details</h3>
        <p className="text-sm text-gray-500">
          View details of this service category.
        </p>
      </div>

      {category.image && (
        <img
          src={category.image}
          alt={category.categoryName || category.name}
          className="w-full h-48 object-cover rounded-lg border"
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Category Name" value={category.categoryName || category.name} />
        <InfoItem label="Status" value={category.status} />
        <InfoItem label="Services Count" value={category.productsCount || 0} />
        <InfoItem
          label="Created"
          value={category.createdAt ? new Date(category.createdAt).toLocaleDateString() : undefined}
        />
      </div>

      {category.description && (
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Description</p>
          <p className="text-sm">{category.description}</p>
        </div>
      )}

      {(() => {
        const linkedServices =
          category.services ||
          category.linkedServices ||
          category.products ||
          [];
        if (!Array.isArray(linkedServices) || linkedServices.length === 0) {
          return (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Attached Services</p>
              <p className="text-sm text-gray-500">
                No services attached to this category yet.
              </p>
            </div>
          );
        }
        return (
          <div>
            <p className="text-xs text-gray-500 mb-2">Attached Services</p>
            <ul className="divide-y border rounded-lg">
              {linkedServices.map((s, i) => (
                <li
                  key={s._id || s.id || i}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {(s.images?.[0] || s.image) && (
                      <img
                        src={s.images?.[0] || s.image}
                        alt={s.name}
                        className="w-8 h-8 rounded object-cover border"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {s.name || s.serviceName || "Untitled"}
                    </span>
                  </div>
                  {s.base_price != null && (
                    <span className="text-sm text-gray-500">
                      ${s.base_price}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}
    </div>
  );
};

export default CategoryDetailsView;
