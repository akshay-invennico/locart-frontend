const CurrencyComponent = ({
  data,
  style,
  sign = "$",
  position = "start",
  ...options
}) => {
  const numericValue =
    typeof data === "string"
      ? parseFloat(data.replace(/[^0-9.-]/g, ""))
      : Number(data);

  const isValidNumber = !isNaN(numericValue) && isFinite(numericValue);

  if (!isValidNumber) {
    return (
      <div style={style} className="whitespace-nowrap">
        -
      </div>
    );
  }

  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue);

  const displayValue =
    position === "end"
      ? `${formattedValue}${sign}`
      : `${sign}${formattedValue}`;

  return (
    <div style={style} className="whitespace-nowrap">
      {displayValue}
    </div>
  );
};

export default CurrencyComponent;
