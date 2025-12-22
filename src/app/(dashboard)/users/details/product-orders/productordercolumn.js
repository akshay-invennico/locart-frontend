export const productOrderColumns = [
  {
    type:"productTable",
    key: "product",
    title: "Product Name",
    isObject: true,
    structure: {
      name: "name",
      image: "image",
    },
    component: {
      type: "standard_avatar",
      style: { radius: "rounded-md", size: "w-12 h-12" },
    },
  },
  { key: "quantity", title: "Quantity" },
  { key: "price", title: "Price" },
  { key: "subtotal", title: "Subtotal" },
];
