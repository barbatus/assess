import { ColumnDef } from "@tanstack/react-table";

import { UserBook } from "~/prisma/generated/type-graphql";

import DataTable from "./data-table";

import { useUserBooks } from "~/hooks/user-books";

export const columns: ColumnDef<UserBook>[] = [
  {
    accessorKey: "book.title",
    header: "Title",
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
    header: "Date",
    meta: { className: 'hidden sm:table-cell' },
    cell: ({ row }) => { 
      return new Date(row.original.date).toLocaleDateString();
    },
  },
];

export const BooksTable = () => {
  const { books, loading, loadNext, loadPrev } = useUserBooks({ userId: 5, status: 'READ' });

  return <DataTable columns={columns} data={books} onNextPage={loadNext} onPrevPage={loadPrev} />;
};
