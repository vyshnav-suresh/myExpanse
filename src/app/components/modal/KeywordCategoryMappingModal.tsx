// components/KeywordCategoryMappingModal.tsx

import React, { useState, useEffect } from "react";
import {
  addExpense,
  addKeywords,
  deleteAllKeywords,
  deleteKeywords,
  fetchKeywords,
} from "@/lib/redux/features/basic/basicSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook/useStatesHook";
import toast from "react-hot-toast";

interface KeywordCategoryMappingModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const KeywordCategoryMappingModal: React.FC<
  KeywordCategoryMappingModalProps
> = ({ isOpen, closeModal }) => {
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
  const [mapping, setMapping] = useState<any>(keywords ?? {});
  const [localStorageKey, setLocalStorageKey] = useState<string>("");
  const [localStorageValue, setLocalStorageValue] = useState<string>("");
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility

  useEffect(() => {
    // Check if keyword_category_mapping exists in localStorage
    // const storedMapping = localStorage.getItem("keyword_category_mapping");

    // if (storedMapping) {
    //   // If exists, parse and set it
    //   setMapping(JSON.parse(storedMapping));
    // }
    dispatch(fetchKeywords());
    console.log("working");
  }, []);

  useEffect(() => {
    if (expense) {
      console.log("Expense", typeof expense);
      // Call expenceCalculator or other logic as needed with expense and keywords
      // expenceCalculator(expense, keywords);
      // dispatch(fetchKeywords());
    }
    if (keywords) {
      console.log(":");
      // setMapping(keywords);
      // dispatch(fetchKeywords());
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
    toast.success(`Item "${key}" deleted successfully!`);
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
    <div
      className={`fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
          </svg>
        </button>
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
              {filteredValues.map((value, index) => (
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
              {keywords &&
                Object.entries(keywords).map(([key, value]: any) => (
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
    </div>
  );
};

export default KeywordCategoryMappingModal;
