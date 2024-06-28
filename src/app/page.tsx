"use client";

import { useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { keyword_category_mapping } from "/home/vyshnav/Documents/Personal/myexpense/src/app/data";
import ArcMeter from "./components/meter";
import GaugeChartComponent from "./components/eCharts/Meter";
import { Table } from "@/components/ui/table";
import { CustomTable } from "./components/CustomTable";
import EChartsComponent from "./components/eCharts/chart/basicBar";
import KeywordCategoryMapping from "./components/KeywordList";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { useAppDispatch, useAppSelector } from "@/lib/hook/useStatesHook";
import {
  addExpense,
  updateCategorySum,
} from "@/lib/redux/features/basic/basicSlice";
import {
  expenceCalculator,
  processExcelDataFromRedux,
} from "@/lib/functions/pdfHandler/handlePdf";
import Badges from "./components/common/Badges";
import { extractKeyValueSeperate } from "@/lib/functions";
import KeywordCategoryMappingModal from "./components/modal/KeywordCategoryMappingModal";
import { ExcelRow } from "@/lib/type";
import Technicals from "./components/eCharts/TechnicalMeter";

// Utility function to set cookies
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

// Function to process Excel data and store in cookie

export default function Home() {
  const { expense, keywords } = useAppSelector((state) => state.basic);

  const dispatch = useAppDispatch();
  const [excelData, setExcelData] = useState<any>(expense ?? []);
  const [total, setTotalAmount] = useState<number>();
  const [open, setOpen] = useState<boolean>(false);

  // const keyword_category_mapping: any = {
  //   fuel: "Fuel",
  //   grocery: "Grocery",
  //   hotel: "Hotel",
  //   restaurant: "Dining",
  //   petrol: "Fuel",
  //   // Add more keyword-category pairs as needed
  // };

  const processExcelDataAndStoreInLocalStorage = (
    rows: ExcelRow[],
    keywordCategoryMapping: any
  ) => {
    // Initialize an object to store category sums
    const categorySums: { [key: string]: number } = {};

    const categorizedData = rows.map((row: ExcelRow) => {
      let category: string = "Uncategorized"; // Default category
      const description = row[1]?.toString().toLowerCase(); // Assuming the description is in the second column
      const date: string = row[0]?.toString();
      const amount = parseInt(row[2]); // Assuming the amount is in the third column

      for (const keyword in keywordCategoryMapping) {
        if (description.includes(keyword)) {
          category = keywordCategoryMapping[keyword];
          break;
        }
      }

      // Update category sum
      if (!categorySums[category]) {
        categorySums[category] = 0;
      }
      categorySums[category] += amount;

      if (date.toLowerCase() !== "date") {
        return { date, description, amount, category };
      }
    });

    const filteredTransactions = categorizedData.filter(
      (transaction: any) => transaction !== null && transaction !== undefined
    );

    const jsonData = JSON.stringify(filteredTransactions);
    localStorage.setItem("excel", jsonData); // Store the categorized data in localStorage
    const data = localStorage.getItem("excel");

    if (data) {
      setExcelData(JSON.parse(data));
      dispatch(addExpense(JSON.parse(data)));
      dispatch(updateCategorySum(categorySums));
    }

    // Store category sums in a separate localStorage entry
    localStorage.setItem("categorySums", JSON.stringify(categorySums));

    return filteredTransactions;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      readXlsxFile(files[0]).then((rows: ExcelRow[]) => {
        const keywordCategoryMapping = keywords;
        const categorizedData = processExcelDataAndStoreInLocalStorage(
          rows,
          keywordCategoryMapping
        );
        setExcelData(categorizedData);
      });
    }
  };

  const totalAmount = excelData.reduce(
    (
      sum: number,
      transaction: {
        date: string;
        description: string;
        amount: number;
        category: string;
      }
    ) => sum + transaction.amount,
    0
  );

  const heading = ["Date", "Description", "Amount", "Category"];
  const keyValue = extractKeyValueSeperate(keywords);

  return (
    <div className=" mt-10 grid grid-col grid-cols-2  w-full px-20 ">
      {/* <div className="flex"> */}
      <div className="w-1/2">
        <GaugeChartComponent value={totalAmount} />
      </div>
      <div className="w-full text-white">
        <EChartsComponent data={""} />
      </div>
      {/* </div> */}

      <div className="w-full">
        <h1 className="text-3xl font-bold mb-5">Excel Viewer</h1>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={() => {
            localStorage.removeItem("excel");
            setExcelData([]);
          }}
        >
          Clear
        </button>
        <div className="w-full">
          {excelData && excelData.length > 0 && (
            // <Table data={excelData} heading={heading} />
            <CustomTable data={expense} />
          )}
        </div>
      </div>
      <div>
        {/* <KeywordCategoryMapping /> */}
        <div className="flex  flex-col">
          <div className=" mx-auto  w-full pb-5">
            <h1 className="text-3xl font-semibold float-left">Categorys</h1>
            <button
              // onClick={handleAddItem}
              className="bg-blue-500 float-right hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setOpen(true)}
            >
              Add
            </button>

            <KeywordCategoryMappingModal
              closeModal={() => setOpen(false)}
              isOpen={open}
            />
          </div>
          <div className="w-full flex-wrap">
            <Badges />
          </div>
          <Technicals />
        </div>
      </div>
    </div>
  );
}
