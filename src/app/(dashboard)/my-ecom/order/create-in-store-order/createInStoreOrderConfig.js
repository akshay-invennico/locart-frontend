"use client";
import { FaImage } from "react-icons/fa";

import ProductGrid from "./ProductGrid";

export const createInStoreOrderConfig = (productOptions = []) => ({
  fields: [
    { type: "divider" },
    {
      type: "inputGroup",
      columns: 3,
      fields: [
        {
          type: "input",
          label: "Client Name",
          name: "name",
          placeholder: "Enter full name",
        },
        {
          type: "input",
          label: "Email",
          name: "email",
          placeholder: "Enter email",
        },
        {
          type: "input",
          label: "Phone Number",
          label2: "(Optional)",
          name: "phone",
          placeholder: "Enter phone",
        },
      ],
    },
    {
      type: "inputGroup",
      columns: 2,
      fields: [
        {
          type: "input",
          label: "Address line 1",
          name: "addressLine1",
          placeholder: "Address line 1",
        },
        {
          type: "input",
          label: "Address line 2",
          label2: "(Optional)",
          name: "addressLine2",
          placeholder: "Address line 2",
        },
      ],
    },
    {
      type: "inputGroup",
      columns: 4,
      fields: [
        {
          type: "input",
          label: "City",
          name: "city",
          placeholder: "City",
        },
        {
          type: "input",
          label: "State",
          name: "state",
          placeholder: "State",
        },
        {
          type: "input",
          label: "Pin",
          name: "pin",
          placeholder: "Pin",
        },
        {
          type: "select",
          name: "country",
          label: "Select Country",
          defaultValue: "USA",
          options: [
            { value: "USA", label: "USA", icon: "/flags/USA.svg" },
            { value: "India", label: "India", icon: "/flags/INDIA.svg" },
            { value: "Germany", label: "Germany", icon: "/flags/GERMANY.svg" },
            { value: "Poland", label: "Poland", icon: "/flags/POLAND.svg" },
            { value: "UK", label: "UK", icon: "/flags/UK.svg" },
            {
              value: "Saudi Arabia",
              label: "Saudi",
              icon: "/flags/SAUDI.svg",
            },
            { value: "UAE", label: "UAE", icon: "/flags/UAE.svg" },
          ],
        },
      ],
    },
    {
      type: "textBlock",
      content: "Product Details:",
      css: { fontSize: "18px", color: "#111111", fontWeight: "bold" },
    },

    {
      type: "selectCheckbox",
      name: "products",
      label: "Select Products",
      showLabel: false,
      options: productOptions,
    },

    {
      type: "customComponent",
      name: "selectedProductsGrid",
      render: (formData, setFormData) => {
        const selected = formData?.products || [];
        if (!selected.length) return null;

        const resolvedProducts = selected
          .map(id => productOptions.find(item => item.value === id))
          .filter(Boolean);


        const products = resolvedProducts.map((p) => ({
          value: p.value,
          label: p.label,
          icon: p?.icon || "profile.jpg",
          quantity: formData?.[`${p.value}_qty`] || 1,
          price: p.price ?? 0,
        }));


        const handleQuantityChange = (id, qty) =>
          setFormData((prev) => ({
            ...prev,
            [`${id}_qty`]: qty,
          }));

        const handleRemove = (id) =>
          setFormData((prev) => ({
            ...prev,
            products: prev.products.filter((p) => p !== id),
          }));

        return (
          <ProductGrid
            products={products}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
        );
      },
    },

    {
      type: "textBlock",
      content: "Payment Details:",
      css: { fontSize: "18px", color: "#111111", fontWeight: "bold" },
    },
    {
      type: "inputGroup",
      columns: 2,
      fields: [
        {
          type: "input",
          label: "Total Payable Amount",
          name: "PayableAmount",
          placeholder: "$0",
        },
        {
          type: "selectCheckbox",
          name: "PaymentMethod",
          label: "Select Payment Method",
          options: [
            {
              value: "Online",
              label: "Online",
            },
            {
              value: "Cash",
              label: "Cash",
            },
          ],
        },
      ],
    },
    {
      type: "inputGroup",
      columns: 2,
      fields: [
        {
          type: "selectCheckbox",
          name: "PaymentStatus",
          label: "Select Payment Status",
          options: [
            {
              value: "Paid",
              label: "Paid",
            },
            {
              value: "Pending",
              label: "Pending",
            },
          ],
        },
        {
          type: "selectCheckbox",
          name: "OrderStatus",
          label: "Select Order Status",
          options: [
            {
              value: "Delivered",
              label: "Delivered",
            },
            {
              value: "Scheduled",
              label: "Scheduled",
            },
          ],
        },
      ],
    },
  ],

  footer: {
    apply: {
      label: "Confirm Order",
      // isSubmit:true,
      className: "bg-[#02C8DE] text-white px-4 py-2 rounded w-full",
      onClick: null
    },
  },
});

