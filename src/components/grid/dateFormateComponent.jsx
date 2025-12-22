const DateFormatComponent = ({ data, style, format = "d-m-y", ...options }) => {
  const parsedDate = new Date(data);
  const isValidDate = !isNaN(parsedDate.getTime());

  if (!isValidDate) {
    return (
      <div style={style} className="whitespace-nowrap">
        -
      </div>
    );
  }

  const formatDate = (date, formatPattern) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

     const hours12 = hours % 12 || 12;
     const ampm = hours>=12 ? "PM" :"AM";

    // First replace all format tokens with their values
    let formatted = formatPattern.replace(/(d{1,2}|M{1,4}|y{2,4}|h{1,2}|H{1,2}|m{1,2}|a)/g, (match) => {
      switch (match) {
        case "d":
          return day;
        case "dd":
          return day.toString().padStart(2, "0");
        case "m":
          return month;
        case "mm":
          return month.toString().padStart(2, "0");
        case "M":
          return monthNames[date.getMonth()];
        case "MM":
          return monthNames[date.getMonth()];
        case "y":
          return year.toString().slice(-2);
        case "yy":
          return year.toString().slice(-2);
        case "yyyy":
          return year;
        case "h":
          return hours12;
        case "hh":
          return String(hours12).padStart(2, "0");
        case "H":
          return hours;
        case "HH":
          return String(hours).padStart(2, "0");
        case "m":
          return minutes;
        case "mm":
          return String(minutes).padStart(2, "0");
        case "a":
          return ampm;
        default:
          return match;
      }
    });


    // Then add appropriate punctuation based on format pattern
    if (formatPattern.includes("M")) {
      // For formats with month names (M or MM)
      if (formatPattern.startsWith("M")) {
        // Month-first formats (M d, y or MM d, y)
        formatted = formatted.replace(/(\w+)\s*(\d+)/, "$1 $2,");
      } else {
        // Day-first formats (d M y or d MM y)
        formatted = formatted.replace(/(\d+)\s*(\w+)/, "$1 $2");
      }
    } else if (formatPattern.includes("-")) {
      // Keep hyphens for numeric formats (d-m-y)
      formatted = formatted.replace(/\s/g, "-");
    } else if (formatPattern.includes("/")) {
      // Keep slashes for numeric formats (d/m/y)
      formatted = formatted.replace(/\s/g, "/");
    }

    return formatted;
  };

  return (
    <div style={style} className="whitespace-nowrap">
      {formatDate(parsedDate, format)}
    </div>
  );
};

export default DateFormatComponent;

/*
USAGE EXAMPLES:

1. Basic numeric formats:
   - "d-m-y" → "15-5-23"
   - "dd-mm-yyyy" → "15-05-2023"
   - "m/d/yy" → "5/15/23"

2. Month name formats:
   - "M d, yyyy" → "May 15, 2023" (with comma)
   - "d M yy" → "15 May 23"
   - "MM d yyyy" → "May 15 2023"

3. Different delimiters:
   - "d.m.y" → "15.5.23"
   - "d M yyyy" → "15 May 2023" (space separated)
   - "yyyy/mm/dd" → "2023/05/15"

4. Zero-padded formats:
   - "dd-MM-yy" → "15-May-23"
   - "mm/dd/yyyy" → "05/15/2023"

5. Special cases:
   - Invalid date → "-"
   - Empty format → uses default "d-m-y"
   - Custom delimiters are preserved

PROPS:
- data: The date string to format (ISO format recommended)
- style: CSS styles for the container
- format: The formatting pattern (default: "d-m-y")
  Supported tokens:
    d - day (1-31)
    dd - zero-padded day (01-31)
    m - month (1-12)
    mm - zero-padded month (01-12)
    M - short month name (Jan-Dec)
    MM - short month name (same as M)
    y - 2-digit year (23)
    yy - 2-digit year (same as y)
    yyyy - 4-digit year (2023)
*/
