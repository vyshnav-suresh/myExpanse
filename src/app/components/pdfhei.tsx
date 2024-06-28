import React, { useState } from "react";
//@ts-ignore
import * as pdfjsLib from "pdfjs-dist/webpack";
import * as XLSX from "xlsx";
import { CustomTable } from "./CustomTable";
import { useAppDispatch, useAppSelector } from "@/lib/hook/useStatesHook";
import { addExpense } from "@/lib/redux/features/basic/basicSlice";

const ExtractTextFromPDF: React.FC = () => {
  // State variables to hold extracted statements and loading state
  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { keywords } = useAppSelector((state) => state.basic);
  const dispatch = useAppDispatch();
  // Function to handle file upload and extract text from PDF
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true); // Set loading state to true
    let statementsArray: any = []; // Initialize array to store statements

    const file = event.target.files?.[0]; // Get uploaded file
    if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer; // Get array buffer from FileReader result
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise; // Load PDF document
        // Iterate through each page in the PDF
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p); // Get page object
          const textContent = await page.getTextContent(); // Get text content of the page

          // Extract text items from the page
          const pageText = textContent.items.map((item: any) => item.str);
          //     .join(" "); // Join all text items with a space

          // Split text into lines

          //   const lines = pageText.split(/\n/);
          const filteredData = pageText.filter(
            (item: any) => item !== (" " || "' '" || !item)
          );

          let filteredArray = filteredData.filter(
            (item: any) => item.trim() !== ""
          );
          let startProcessing = false;

          let table = [];
          for (let i = 0; i < filteredArray.length; i++) {
            const currentItem = filteredArray[i];

            if (currentItem === "Domestic Transactions") {
              startProcessing = true;
              continue;
            }

            if (startProcessing) {
              // Check if the current item matches date format (DD/MM/YYYY)
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(currentItem.trim())) {
                let amountString, amount;
                const date = currentItem.trim();
                const description = filteredArray[i + 1].trim();
                amountString = filteredArray[i + 2].trim().replace(",", "");
                if (!amountString.includes("Cr")) {
                  for (let j = 2; j < 5; j++) {
                    amountString = parseFloat(
                      filteredArray[i + j].trim().replace(",", "")
                    );
                    //   console.log(amountString);
                    if (
                      typeof amountString === "number" &&
                      !Number.isNaN(amountString)
                    ) {
                      amount = amountString;
                      statementsArray.push({
                        date,
                        description,
                        amount: amount,
                      });
                      break;
                    }
                  }
                }
                // Skip the next two items since they are already processed
                i += 2;
              }
            }
          }

          let shouldExtract = false;

          // Iterate through lines to find "Domestic Transactions" and extract statements
          //   for (let j = 0; j < lines.length; j++) {
          //     const line = lines[j].trim();

          //     // Check if we should start extracting after encountering "Domestic Transactions"
          //     if (!shouldExtract) {
          //       const searchTerm = "Domestic Transactions";
          //       if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
          //         shouldExtract = true;
          //       }
          //     }

          //     // Extract statement details if we should extract
          //     if (shouldExtract && /^\d{2}\/\d{2}\/\d{4}/.test(line)) {
          //       const match = line.match(
          //         /^(\d{2}\/\d{2}\/\d{4})\s+(.*)\s+([\d.,]+)\s*$/
          //       );
          //       if (match) {
          //         const date = match[1];
          //         const statement = match[2];
          //         const amount = parseFloat(match[3].replace(/,/g, ""));

          //         // Push statement object into statementsArray
          //         statementsArray.push({
          //           date,
          //           statement,
          //           amount,
          //         });
          //       }
          //     }
          //   }
          console.log(p);
        }

        const jsonBlob = new Blob([JSON.stringify(statementsArray, null, 2)], {
          type: "application/json",
        });

        // Create a URL for the blob
        const url = URL.createObjectURL(jsonBlob);

        // Create a link and click it to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "statements.json";
        // link.click();
        setStatements(statementsArray); // Set extracted statements in state
        console.log("ithalla", statementsArray);

        setLoading(false); // Set loading state to false
      };
      if (statementsArray) {
        dispatch(addExpense(statementsArray));
      }
      localStorage.setItem("excel", JSON.stringify(statementsArray));

      reader.readAsArrayBuffer(file); // Read uploaded file as an array buffer
    }

    exportToExcel();
  };

  const exportToExcel = () => {
    const fileName = "Statements.xlsx";
    console.log("heu", statements);

    const worksheet = XLSX.utils.json_to_sheet(statements);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Render component UI
  return (
    <div className="w-full h-auto  flex  flex-col">
      <h1>Extract Text from PDF</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
      />{" "}
      <div>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>
      {/* File input for PDF upload */}
      {/* Conditional rendering based on loading state */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="">
          <div>
            {statements.length > 0 ? (
              <div>
                <h2>Statements</h2>
                <CustomTable data={statements} />
                {/* <ul className="overflow-scroll"> */}

                {/* {statements.map((statement, index) => (
                    <li key={index}>
                      <p>Date: {statement.date}</p>
                      <p>Statement: {statement.statement}</p>
                      <p>Amount: {statement.amount}</p>
                    </li>
                  ))} */}
                {/* </ul> */}
              </div>
            ) : (
              <p>No statements found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractTextFromPDF;
