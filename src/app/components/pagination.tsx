import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";
type props = {
  currentPage: number;
  totalPages: any;
  handlePreviousPage: any;
  handleNextPage: any;
  handlePageClick: any;
};
const CustomPagination = ({
  handlePreviousPage,
  handleNextPage,
  currentPage,
  totalPages,
  handlePageClick,
}: props) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePreviousPage()} />
        </PaginationItem>
        {totalPages.map((pageNumber: any, key: number) => (
          <PaginationItem key={key}>
            <PaginationLink onClick={() => handlePageClick(pageNumber)}>
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => handleNextPage()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
