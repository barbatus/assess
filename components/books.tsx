import { useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react"
import set from "lodash.set";

import { UserBook, UserBookOrderByWithRelationInput } from "~/prisma/generated/type-graphql";

import { Button } from "./ui/button";
import DataTable from "./data-table";

import { useUserBooks } from "~/hooks/user-books";

export const columns: ColumnDef<UserBook>[] = [
  {
    accessorKey: "book.title",
    header: ({ column }) => {
      const sortIcon = column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" /> ;
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {column.getIsSorted() && sortIcon}
        </Button>
      )
    },
    cell: ({ row }) => { 
      return (
        <div className="text-left capitalize">
          <h5>{row.original.book?.title}</h5>
          <div className="flex sm:hidden justify-between text-muted-foreground mt-2">
            <div className="text-sm">Author: {row.original.book?.author}</div>
            <div className="text-xs">Date: {new Date(row.original.date).toLocaleDateString()}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "book.author",
    header: "Author",
    meta: { className: 'hidden sm:table-cell' },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      const sortIcon = column.getIsSorted() === "asc" ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />;
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {column.getIsSorted() && sortIcon}
        </Button>
      )
    },
    meta: { className: 'hidden sm:table-cell' },
    cell: ({ row }) => { 
      return new Date(row.original.date).toLocaleDateString();
    },
  },
];

export const BooksTable = (opts: { status: 'READ' | 'READING' | 'WANT_TO_READ' }) => {
  const [sortingState, setSortingState] = useState<SortingState>([]);

  const order = sortingState.map((sort) => {
    return set<UserBookOrderByWithRelationInput>({}, sort.id.split('_'), sort.desc ? "desc" : "asc")
  }) as UserBookOrderByWithRelationInput[];

  const { books, loading, loadNext, loadPrev } = useUserBooks({ userId: 5, order, status: opts.status });

  return <DataTable columns={columns} data={books} onSorting={setSortingState} onNextPage={loadNext} onPrevPage={loadPrev} />;
};
