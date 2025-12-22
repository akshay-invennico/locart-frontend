"use client";
export const invoicePreviewConfig = {
  fields: [

    { type: "divider" },

    {
      type: "invoiceSummary",
      items: [
        { label: "Customer Name", value: "John Doe",divider: false  },
        { label: "Invoice Date", value: "2025-10-27" },
        {
          label: "Invoice ID",
          value: "#BK1023102456145258",
          color: "#02C8DE",
        },

        { label: "Item Total", value: "$5,000.00" },
        { label: "Taxes", value: "$250.00"},
        { label: "Delivery Charges", value: "$100.00"},
        { label: "Total", value: "$5,350.00"},
        { label: "Loyalty Discount", value: "-$150.00"},
        {
          label: "Total Payable Amount",
          value: "$5,200.00",
          bold: true,
          large: true,
        },
      ],
    },
  ],
};
