//@ts-ignore
import { ExcelRow } from "@/lib";
//@ts-ignore
import * as pdfjsLib from "pdfjs-dist/webpack";
import * as XLSX from "xlsx";

type handlePdfProps = {
  event: React.ChangeEvent<HTMLInputElement>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStatements: React.Dispatch<React.SetStateAction<any[]>>;
  statements: any;
};

type exportEcelProps = {
  statements: any;
};
export const handleFileUpload = async ({
  event,
  setLoading,
  setStatements,
  statements,
}: handlePdfProps) => {
  setLoading(true); // Set loading state to true

  const file = event.target.files?.[0]; // Get uploaded file
  let statementsArray: any = []; // Initialize array to store statements

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
      link.click();
      setStatements(statementsArray); // Set extracted statements in state
      setLoading(false); // Set loading state to false
    };

    reader.readAsArrayBuffer(file); // Read uploaded file as an array buffer
  }
  console.log(statementsArray);
};

export const exportToExcel = ({ statements }: exportEcelProps) => {
  const fileName = "Statements.xlsx";
  console.log(statements);

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

export const processExcelDataFromRedux = (
  rows: ExcelRow[],
  keywordCategoryMapping: any
) => {
  // Initialize an object to store category sums
  const categorySums: { [key: string]: number } = {};

  const categorizedData = rows.map((row: ExcelRow) => {
    let category: string = "Uncategorized"; // Default category
    const description = row.description.toLowerCase(); // Assuming the description is already in lowercase
    const amount = row.amount;

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

    return { ...row, category }; // Return the modified row with category assigned
  });

  const filteredTransactions = categorizedData.filter(
    (transaction: any) => transaction !== null && transaction !== undefined
  );

  const jsonData = JSON.stringify(filteredTransactions);
  localStorage.setItem("excel", jsonData); // Store the categorized data in localStorage

  // Store category sums in a separate localStorage entry
  localStorage.setItem("categorySums", JSON.stringify(categorySums));

  return filteredTransactions;
};

interface ExcelRow {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export const expenceCalculator = (
  rows: ExcelRow[],
  keywords: { [key: string]: string }
) => {
  // Initialize an object to store category sums
  const categorySums: { [key: string]: number } = {};

  if (rows) {
    console.log("camon", typeof rows);

    const categorizedData = rows.map((row: ExcelRow) => {
      let category: string = row.category; // Start with existing category
      const description = row.description.toLowerCase();
      const amount = row.amount;

      // Check if description contains any keyword
      for (const keyword in keywords) {
        if (description.includes(keyword.toLowerCase())) {
          category = keywords[keyword];
          break;
        }
      }

      // Update category sum
      if (!categorySums[category]) {
        categorySums[category] = 0;
      }
      categorySums[category] += amount;

      return { ...row, category }; // Return the modified row with updated category
    });

    const filteredTransactions = categorizedData.filter(
      (transaction: any) => transaction !== null && transaction !== undefined
    );

    const jsonData = JSON.stringify(filteredTransactions);
    localStorage.setItem("excel", jsonData); // Store the categorized data in localStorage

    // Store category sums in a separate localStorage entry
    localStorage.setItem("categorySums", JSON.stringify(categorySums));
    return filteredTransactions;
  }
  return [];
};
