import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const UserRowProfile = ({ image, name, email, time }) => {
  return (
    <div className="w-auto flex flex-row items-center space-x-2">
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={image || "https://github.com/leerob.png"}
          alt="user"
          className="rounded-full"
        />
        <AvatarFallback>N/A</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-[4px]">
        <span className="text-sm font-medium text-[#282928]">{name}</span>
        <span className="text-xs text-[var(--color-dull-text)]">
          {email || time}
        </span>
      </div>
    </div>
  );
};

export const ProductRowProfile = ({ image, productName }) => {
  return (
    <div className="w-auto flex flex-row items-center space-x-2">
      <Avatar className="w-10 h-10 rounded-[8px] border border-secondary1">
        <AvatarImage
          src={image || "https://github.com/leerob.png"}
          alt="user"
        />
        <AvatarFallback>N/A</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-[4px]">
        <span className="text-sm font-medium text-black">{productName}</span>
      </div>
    </div>
  );
};

export const GetStatusBadge = ({ status }) => {
  return (
    <Badge
      className={
        status === "active"
          ? "bg-[#EAFFED] text-[#097416] px-[8px] py-[12px] w-[75px] h-[31px] rounded-[4px]  text-center "
          : status === "inactive"
            ? "bg-[#EEEEEE] text-[#7B7B7B``] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
            : status === "suspended"
              ? "bg-[#FFF0F1 ] text-[#BC0D10] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
              : status === "upcoming"
                ? "bg-[#E5FCFF] text-[#02C8DE] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                : status === "completed"
                  ? "bg-[#EAFFED] text-[#097416] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                  : status === "cancelled"
                    ? "bg-[#FFF0F0] text-[#BC0D10] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                    : status === "pending"
                      ? "bg-[#FFF6E8] text-[#FF9800] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                      : status === "shipped"
                        ? "bg-[#E5FCFF] text-[#02C8DE] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                        : status === "returned"
                          ? "bg-[#F0F0F0] text-[#7B7B7B] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                          : status === "delivered"
                            ? "bg-[#FFF0F0] text-[#BC0D10] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                            : status === "paid"
                              ? "bg-[#EAFFED ] text-[#097416] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                              : status === "inprocess"
                                ? "bg-[#FFFAE9] text-[#FF9800] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                                : status === "expired"
                                  ? "bg-[#FFF0F0] text-[#BC0D10] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                                  : status === "open"
                                    ? "bg-[#EEEEEE] text-[#7B7B7B] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                                    : status === "resolved"
                                      ? "bg-[#EAFFED] text-[#097415] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                                      : status === "checking"
                                        ? "bg-[#E5FCFF] text-[#02C8DE] px-[8px] py-[4px] w-[75px] h-[31px] rounded-[4px]  text-center"
                                        : ""
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const getUserFromToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const { tokens } = JSON.parse(raw);
    const token = tokens?.accessToken;
    if (!token) return null;
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const prepareGridData = (rows = [], columns = []) => {
  if (!rows.length || !columns.length) return { headers: [], flatRows: [] };

  const filteredColumns = columns.filter((col) => {
    const key = col.key || col.accessorKey || col.field || "";
    const title = col.title || col.headerName || col.label || "";
    return key.toLowerCase() !== "actions" && title.toLowerCase() !== "actions";
  });

  const headers = filteredColumns.map(
    (c) => c.title || c.headerName || c.label
  );

  const flatRows = rows.map((row) =>
    filteredColumns.map((col) => {
      const key = col.key || col.accessorKey || col.field;

      if (key === "user") return row.name ?? "";
      if (key === "clientName") return row.client?.name ?? "";
      if (key === "stylistName") return row.stylist?.name ?? "";
      if (key === "serviceNames")
        return row.services?.map((s) => s.name).join(", ") ?? "";

      let value = row[key];

      if (value === undefined || value === null) return "";
      if (Array.isArray(value)) return value.join(", ");
      if (typeof value === "object") return value.name || "";

      return String(value);
    })
  );

  return { headers, flatRows };
};


export const exportGridPDF = async ({ rows, columns, filename = "export.pdf", title = "Report" }) => {
  const { headers, flatRows } = prepareGridData(rows, columns);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.text(title, 40, 40);

  autoTable(doc, {
    startY: 60,
    head: [headers],
    body: flatRows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [230, 230, 230] },
    theme: "grid",
  });

  doc.save(filename);
};


export const exportGridCSV = ({ rows, columns, filename = "export.csv" }) => {
  const { headers, flatRows } = prepareGridData(rows, columns);

  // Force Excel to treat everything as text
  const safeCSVValue = (value) => {
    if (value === null || value === undefined) return '""';
    value = String(value);

    // Wrap all values in ="value" to force text in Excel
    value = value.replace(/"/g, '""'); // escape quotes
    return `="${value}"`;
  };

  // Header row
  let csv = headers.map(safeCSVValue).join(",") + "\n";

  // Data rows
  for (const row of flatRows) {
    csv += row.map(safeCSVValue).join(",") + "\n";
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};


export const generateInvoicePDF = (invoiceData) => {
  const {
    invoiceNo,
    issueDate,
    dueDate,
    client,
    items,
    subtotal,
    tax,
    total,
    deliveryDate
  } = invoiceData;

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // Styles
  const primaryColor = "#111111"; // approximated from styles
  const secondaryColor = "#666666";

  // --- Header ---
  // Logo (Placeholder if image URL is not valid/accessible, using circle)
  // doc.addImage(...) - requires base64 or valid URL. Using text placeholder for robustness if image fails, or try standard image.
  // Using a simple circle to mimic logo
  doc.setDrawColor(0);
  doc.setFillColor(200, 200, 200);
  doc.circle(65, 65, 25, 'F');

  // Company Info (Right aligned)
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor);
  doc.text("INVOICE", 555, 60, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(secondaryColor);
  doc.text("TAX INVOICE", 555, 75, { align: "right" });

  const companyInfoY = 90;
  doc.text("Locart", 555, companyInfoY, { align: "right" });
  doc.text("New York", 555, companyInfoY + 12, { align: "right" });
  doc.text("505", 555, companyInfoY + 24, { align: "right" });
  doc.text("New York New York 390012", 555, companyInfoY + 36, { align: "right" });
  doc.text("United States", 555, companyInfoY + 48, { align: "right" });
  doc.text("Tax Reg. No.: FLKA3124G", 555, companyInfoY + 60, { align: "right" });
  doc.text("locart@gmail.com", 555, companyInfoY + 72, { align: "right" });

  // --- Bill To & Details ---
  const billToY = 190;

  // Bill To (Left)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor);
  doc.text("BILL TO", 40, billToY);

  doc.setFont("helvetica", "normal");
  doc.text(client.name || "", 40, billToY + 15);
  doc.text(client.address || "Sarabhai Campus, K10 Grand", 40, billToY + 27);
  doc.text(client.cityState || "390012 Vadodara Gujarat", 40, billToY + 39);
  doc.text(client.country || "India", 40, billToY + 51);

  doc.text(`Business ID:    5362789103493857`, 40, billToY + 70);
  doc.text(`:                     9483767289287364`, 40, billToY + 82);

  // Invoice Details (Right)
  const detailsX = 400;
  const valX = 555;
  const lineH = 15;

  const drawDetailRow = (label, value, y) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(secondaryColor);
    doc.text(label, detailsX, y);
    doc.setTextColor(primaryColor); // value color
    doc.text(value, valX, y, { align: "right" });
  };

  drawDetailRow("Invoice No.:", String(invoiceNo), billToY);
  drawDetailRow("Issue date:", String(issueDate), billToY + lineH);
  drawDetailRow("Due date:", String(dueDate), billToY + lineH * 2);
  drawDetailRow("Delivery date:", String(deliveryDate || issueDate), billToY + lineH * 3 + 5);

  // --- Table ---
  const tableHeaders = [["DESCRIPTION", "QUANTITY", "UNIT PRICE ($)", "DISCOUNT %", "AMOUNT ($)"]];
  const tableData = items.map(item => [
    item.description,
    item.quantity,
    Number(item.price).toFixed(2),
    Number(item.discount).toFixed(2),
    Number(item.amount).toFixed(2)
  ]);

  autoTable(doc, {
    startY: 320,
    head: tableHeaders,
    body: tableData,
    headStyles: { fillColor: [102, 102, 102], textColor: 255, halign: 'center' },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    },
    styles: { fontSize: 10, cellPadding: 8 },
    theme: 'plain', // mimic the look provided
    didDrawPage: (data) => {
      // Optional footer if needed per page
    }
  });

  const finalY = doc.lastAutoTable.finalY + 20;

  // --- Footer & Totals ---

  // Thank you message
  doc.setFont("helvetica", "italic");
  doc.setTextColor(secondaryColor);
  doc.text("Thank you for the business", 40, finalY + 10);

  // Totals (Right aligned)
  const totalsXLabel = 380;
  const totalsXValue = 555;

  const drawTotalRow = (label, value, y, isBold = false) => {
    doc.setFont("helvetica", isBold ? "bold" : "bold"); // Labels are bold in image
    doc.setTextColor(primaryColor);
    doc.text(label, totalsXLabel, y);
    doc.text(value, totalsXValue, y, { align: "right" });
  };

  let currentY = finalY;

  // Divider
  doc.setDrawColor(200);
  doc.line(30, currentY, 565, currentY); // full width line
  currentY += 20;

  drawTotalRow("SUBTOTAL:", `$${Number(subtotal).toFixed(2)}`, currentY);
  currentY += 15;

  drawTotalRow(`TAX 8% from $${Number(subtotal).toFixed(2)}`, `$${Number(tax).toFixed(2)}`, currentY);
  currentY += 15;

  drawTotalRow("TOTAL (USD):", `$${Number(total).toFixed(2)}`, currentY);
  currentY += 15;

  // Grand Total divider
  doc.setDrawColor(0);
  doc.setLineWidth(1);
  doc.line(totalsXLabel, currentY, 555, currentY);
  currentY += 20;

  doc.setFontSize(12);
  drawTotalRow("TOTAL DUE (USD)", `$${Number(total).toFixed(2)}`, currentY, true);

  doc.save(`Invoice-${invoiceNo}.pdf`);
};
