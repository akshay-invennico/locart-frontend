"use client";

const BadgeComponent = ({ data, style = {}, value = {} }) => {
  const statusValue = typeof data === "string" ? data.trim().toLowerCase() : "";

  const displayText = data
    ? data.charAt(0).toUpperCase() + data.slice(1).toLowerCase()
    : "-";

  const statusColor = value[statusValue] || "#6B7280";

  const borderRadius = style.borderRadius || "9999px";

  const { borderRadius: _, ...restStyle } = style;

  return (
    <div
      style={{
        ...restStyle,
        backgroundColor: `${statusColor}15`,
        color: statusColor,
        width: "100%",
        maxWidth: "75px",
        justifyContent: "center",
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 12px",
        textAlign: "center",
        borderRadius: borderRadius,
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1.25,
      }}
      className="whitespace-nowrap"
    >
      {displayText}
    </div>
  );
};

export default BadgeComponent;
