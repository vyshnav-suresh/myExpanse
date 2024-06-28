"use client";
import { expenceCalculator } from "@/lib/functions/pdfHandler/handlePdf";
import { useAppDispatch, useAppSelector } from "@/lib/hook/useStatesHook";
import {
  addExpense,
  addKeywords,
  deleteAllKeywords,
  deleteKeywords,
  fetchKeywords,
} from "@/lib/redux/features/basic/basicSlice";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";

const KeywordCategoryMapping = () => {
  const defaultMapping = {
    fuel: "Fuel",
    grocery: "Grocery",
    hotel: "Hotel",
    restaurant: "Dining",
    petrol: "Fuel",
    // Add more keyword-category pairs as needed
  };
  const { expense, keywords } = useAppSelector((state: any) => state.basic);
  const dispatch = useAppDispatch();
  const [mapping, setMapping] = useState(keywords ?? {});
  // const [mapping, setMapping] = useState(keywords ?? {});
  const [localStorageKey, setLocalStorageKey] = useState("");
  const [localStorageValue, setLocalStorageValue] = useState("");
  const [filteredValues, setFilteredValues] = useState<any>([]);
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility

  useEffect(() => {
    // Check if keyword_category_mapping exists in localStorage
    const storedMapping = localStorage.getItem("keyword_category_mapping");

    if (storedMapping) {
      // If exists, parse and set it
      setMapping(JSON.parse(storedMapping));
    }
    console.log(storedMapping);
    dispatch(fetchKeywords());
    // else {
    //   // If not exists, set the default mapping in localStorage
    //   localStorage.setItem(
    //     "keyword_category_mapping",
    //     JSON.stringify(defaultMapping)
    //   );
    //   setMapping(defaultMapping);
    // }
  }, []);
  useEffect(() => {
    // Check if keyword_category_mapping exists in localStorage
    // const data = processExcelDataAndStoreInLocalStorage(expense, keywords);
    // dispatch(addExpense(data));
    if (expense) {
      console.log("Expense", typeof expense);

      expenceCalculator(expense, keywords);
    }
    if (!keywords) {
      setMapping(keywords);
    }
    if (keywords) {
      setMapping(keywords);
    }
  }, [keywords]);

  const handleAddItem = () => {
    if (localStorageKey && localStorageValue) {
      dispatch(
        addKeywords({
          localStorageKey: localStorageKey,
          localStorageValue: localStorageValue,
        })
      );
      toast.success(`Item "${localStorageKey}" added successfully!`);
      setLocalStorageKey(""); // Clear input after adding item
      setLocalStorageValue(""); // Clear input after adding item
    } else {
      toast.error("Please enter both key and value.");
    }
  };

  const handleDeleteItem = (key: any) => {
    dispatch(deleteKeywords(key));
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "localStorageKey") {
      setLocalStorageKey(value);
    } else if (name === "localStorageValue") {
      setLocalStorageValue(value);

      // Filter values based on input
      const filtered = Object.values(mapping).filter((val: any) =>
        val.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredValues(filtered);

      // Show dropdown if there are filtered values, hide otherwise
      setShowDropdown(filtered.length > 0);
    }
  };

  const selectValue = (value: string) => {
    setLocalStorageValue(value);
    setShowDropdown(false); // Hide dropdown after selecting a value
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Keyword Category Mapping</h1>
      <div className="mb-4">
        <label className="block mb-2">Key:</label>
        <input
          type="text"
          name="localStorageKey"
          value={localStorageKey}
          onChange={handleInputChange}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Value:</label>
        <input
          type="text"
          name="localStorageValue"
          value={localStorageValue}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(filteredValues.length > 0)}
          onBlur={() => setShowDropdown(false)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
        />
        {showDropdown && (
          <select
            size={filteredValues.length > 0 ? filteredValues.length : 1}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500 mt-2"
            onChange={(e) => selectValue(e.target.value)}
          >
            {filteredValues.map((value: any, index: number) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleAddItem}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Item
        </button>
        <button
          onClick={() => dispatch(deleteAllKeywords())}
          className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Clear All
        </button>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Current Mapping:</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Key
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Value
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-scroll max-h-[500px]">
            {Object.entries(mapping).map(([key, value]: any) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap">{key}</td>
                <td className="px-6 py-4 whitespace-nowrap">{value}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteItem(key)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordCategoryMapping;
