import { productColumns } from "./productColumn";
import GridCommonComponent from "@/components/grid/gridCommonComponent";

export default function ProductSection({ products }) {
  const options = {
    select: false,
    order: false,
    sortable: true,
  };

  const hasProducts = Array.isArray(products) && products.length > 0;
  return (
    <div className="w-full border rounded-lg p-4 h-full">
      <div className="mt-2">
        <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>

        {hasProducts ? (
          <GridCommonComponent
            className="h-full"
            data={products}
            columns={productColumns}
            options={options}
            theme={{
              border: "border-gray-300",
              header: { bg: "bg-gray-100" },
            }}
          />
        ) : (
          <div className="w-full text-center py-20 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}