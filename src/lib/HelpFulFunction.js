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

