import { useAppSelector, useAppDispatch } from "@/lib/hook/useStatesHook";
import { updateMaxAmount } from "@/lib/redux/features/settings/settingsSlice";
import React, { useRef, useState } from "react";

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const maxAmountRef = useRef<HTMLInputElement>(null);
  const otherValueRef = useRef<HTMLInputElement>(null);
  const { maxAmount } = useAppSelector((state) => state.settings);
  const [amount, setAmount] = useState(maxAmount);
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "maxAmount":
        dispatch(updateMaxAmount(Number(value)));
        break;
      //   case "otherValue":
      //     dispatch(updateOtherValue(value));
      //     break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full px-20 py-2">
      <div className="flex gap-2 justify-center items-center">
        <p>Max Amount</p>
        <input
          type="number"
          name="maxAmount"
          defaultValue={amount}
          ref={maxAmountRef}
          className="rounded-xl h-10 border-2 w-20 focus:outline-0 dark:text-black"
          onBlur={handleBlur}
        />
      </div>
      <div className="flex gap-2 justify-center items-center">
        <p>Other Value</p>
        <input
          type="text"
          name="otherValue"
          ref={otherValueRef}
          className="rounded-xl h-10 border-2 w-20 focus:outline-0"
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default FilterSection;
