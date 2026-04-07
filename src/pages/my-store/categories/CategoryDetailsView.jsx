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
    </div>
  );
};

export default CategoryDetailsView;
