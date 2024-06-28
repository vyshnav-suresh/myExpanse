// components/Badges.tsx

import { extractKeyValueSeperate } from "@/lib/functions";
import { useAppSelector } from "@/lib/hook/useStatesHook";
import React, { useState } from "react";

const Badges: React.FC = () => {
  const [chips, setChips] = useState<string[]>();
  const { expense, keywords } = useAppSelector((state) => state.basic);
  const keyValue = extractKeyValueSeperate(keywords);

  const handleRemoveChip = (indexToRemove: number) => {
    setChips((prevChips) =>
      keyValue.keys.filter((_: any, index: number) => index !== indexToRemove)
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {keyValue.keys.map((item: any, index: number) => (
        <div
          key={index}
          className="inline-flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
        >
          <span>
            {item}:{keyValue.values[index]}
          </span>
          <button
            type="button"
            onClick={() => handleRemoveChip(index)}
            className="ml-2 text-white hover:text-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>{" "}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Badges;
