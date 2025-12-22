"use client";

const PhoneComponent = ({ data, style }) => {
  return (
    <div style={style} className="whitespace-nowrap">
      {data || "-"}
    </div>
  );
};

export default PhoneComponent;
