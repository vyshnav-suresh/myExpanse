import { ExcelRow } from "@/lib";
import { formatDate } from "@/lib/functions";
import React from "react";

interface TableProps {
  data: ExcelRow[];
  heading: string[];
}

const Table: React.FC<TableProps> = ({ data, heading }) => {
  // data.map((row, index) => {
  //   console.log(row);
  // });
  return (
    <table className="table-auto mt-5">
      <thead>
        <tr>
          {heading.map((row: string, index) => (
            <th key={index} className="px-4 py-2">
              {row}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          return index == 0 ? (
            <tr key={index}>
              <td className="border px-4 py-2">{row[0]}</td>{" "}
              {/* Assuming date is in the first column */}
              <td className="border px-4 py-2">{row[1]}</td>{" "}
              {/* Assuming description is in the second column */}
              <td className="border px-4 py-2">{row[2]}</td>{" "}
              {/* Assuming amount is in the third column */}
              <td className="border px-4 py-2">{"category"}</td>{" "}
              {/* Category added in handleFileChange */}
            </tr>
          ) : (
            <tr key={index}>
              <td className="border px-4 py-2">{formatDate(row[0])}</td>{" "}
              {/* Assuming date is in the first column */}
              <td className="border px-4 py-2">{row[1]}</td>{" "}
              {/* Assuming description is in the second column */}
              <td className="border px-4 py-2">{row[2]}</td>{" "}
              {/* Assuming amount is in the third column */}
              <td className="border px-4 py-2">{row.category}</td>{" "}
              {/* Category added in handleFileChange */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
