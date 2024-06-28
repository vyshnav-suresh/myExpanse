"use client";

import { useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { keyword_category_mapping } from "/home/vyshnav/Documents/Personal/myexpense/src/app/data";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { useAppDispatch, useAppSelector } from "@/lib/hook/useStatesHook";
import { addExpense } from "@/lib/redux/features/basic/basicSlice";
import {
  expenceCalculator,
  processExcelDataFromRedux,
} from "@/lib/functions/pdfHandler/handlePdf";
import KeywordCategoryMapping from "../components/KeywordList";

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

  const heading = ["Date", "Description", "Amount", "Category"];

  return (
    <div className="container mt-10 grid grid-col grid-cols-2  w-full">
      <div>
        <KeywordCategoryMapping />
      </div>
    </div>
  );
}
