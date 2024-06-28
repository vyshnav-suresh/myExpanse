import React from "react";

type Props = {
  value: number;
};

const ArcMeter = ({ value }: Props) => {
  const getColor = (value: number) => {
    if (value <= 30) {
      return "border-blue-500";
    } else if (value <= 60) {
      return "border-yellow-500";
    } else {
      return "border-red-500";
    }
  };

  return (
    <div className="relative w-52 h-52">
      <div className="absolute w-full h-full rounded-full border-2 border-gray-200"></div>
      <div
        className={`absolute w-full h-full rounded-full ${getColor(
          value
        )} border-[10px] transform origin-bottom-left`}
        style={{
          clipPath: "polygon(80% 0%, 0% 0%, 0% 0%, 20% 20%, 20)",
          // transform: `rotate(${value * 1.8}deg)`,
        }}
      ></div>
    </div>
  );
};

export default ArcMeter;
