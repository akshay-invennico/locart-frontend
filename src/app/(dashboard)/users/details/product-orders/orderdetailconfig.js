export const orderDetailsConfig = {
  formCss: {
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },

  fields: [
    {
      type: "productTable",
      name: "products",
      headers: ["Product Name", "Quantity", "Price", "Subtotal"],
      rows: [
        {
          product: {
            name: "Aloe Locking Gel",
            image: `https://picsum.photos/512?random=${Math.floor(
              Math.random() * 100
            )}`,
          },
          quantity: 2,
          price: "$400",
          subtotal: "$800.00",
        },
        {
          product: {
            name: "Aloe Locking Gel",
            image: `https://picsum.photos/512?random=${Math.floor(
              Math.random() * 100
            )}`,
          },
          quantity: 2,
          price: "$400",
          subtotal: "$800.00",
        },
      ],
      total: "$1600.00",
    },
  ],
};
