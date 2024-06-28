import { getDegreeFromValue } from "@/lib/functions";
import { useAppSelector } from "@/lib/hook/useStatesHook";
import { useEffect, useRef, useState } from "react";
const Technicals = () => {
  const { maxAmount } = useAppSelector((state) => state.settings);
  const { totalAmount } = useAppSelector((state) => state.basic);

  const rating = getDegreeFromValue(totalAmount ?? 0, maxAmount ?? 0); // Example value, replace with your logic
  const percentage = (rating / 100) * 100; // Convert rating to percentage

  const getColor = (percent: number) => {
    if (percent <= 20) return "lightgreen";
    if (percent <= 40) return "yellow";
    if (percent <= 60) return "orange";
    if (percent <= 80) return "orangered";
    return "red";
  };

  const color = getColor(percentage);

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="relative w-full max-w-md">
        <div className="w-full h-8 bg-slate-200 rounded-full overflow-hidden relative">
          <div
            className="h-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              transition: "width 2s ease-out",
            }}
          ></div>
          <div
            className="absolute top-0 transform -translate-y-1/2 w-8 h-8 bg-white shadow-black shadow-md rounded-full"
            style={{
              left: `${percentage}%`,
              transition: "left 2s ease-out",
              transform: "translateX(-50%)",
            }}
          ></div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-lg">Neutral {rating}</div>
        <div className="flex justify-between mt-2 text-sm w-full max-w-md">
          <span>Strong sell</span>
          <span>Sell</span>
          <span>Neutral</span>
          <span>Buy</span>
          <span>Strong buy</span>
        </div>
      </div>
    </div>
  );
};

export default Technicals;
