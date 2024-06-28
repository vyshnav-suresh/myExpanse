import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomPagination from "./pagination";
import { useAppSelector } from "@/lib/hook/useStatesHook";

type Props = {
  data: any;
};

const ITEMS_PER_PAGE = 5;
const MAX_PAGE_OPTIONS = 5;

export function CustomTable({ data }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // Function to calculate the total amount
  const calculateTotalAmount = () => {
    return data.reduce((total: number, item: { amount: number }) => {
      return total + (typeof item.amount === "number" ? item.amount : 0);
    }, 0);
  };

  // Pagination controls
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate page numbers to display in the pagination controls
  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(
      1,
      Math.min(
        currentPage - Math.floor(MAX_PAGE_OPTIONS / 2),
        totalPages - MAX_PAGE_OPTIONS + 1
      )
    );

    for (
      let i = startPage;
      i < startPage + MAX_PAGE_OPTIONS && i <= totalPages;
      i++
    ) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="w-full ">
      <Table className="w-full">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Transactions</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map(
            (
              invoice: {
                date: string;
                description: string;
                amount: number;
                category: string;
              },
              key: number
            ) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{invoice.date}</TableCell>
                <TableCell className="w-full">{invoice.description}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.category}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {calculateTotalAmount()}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <CustomPagination
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        totalPages={getPageNumbers()}
        handlePageClick={handlePageClick}
      />
      {/* <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={pageNumber === currentPage ? "active" : ""}
          >
            {pageNumber}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div> */}
    </div>
  );
}
