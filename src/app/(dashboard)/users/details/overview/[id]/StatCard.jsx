import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({
  data,
  icon: Icon,
}) => {
  const isUp = data.trend === "up";

  return (
    <div
      className={`${data.bgColor} text-white rounded-lg p-4 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-90">{data.title}</p>
          <h2 className="text-3xl font-bold mt-2">{data.value}</h2>
        </div>

        <div className="bg-white/20 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm opacity-90">{data.subText}</p>

        <div className="flex items-center gap-1 text-sm font-medium">
          {isUp ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span>{data.percentage}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
