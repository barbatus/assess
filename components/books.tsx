import { useState, useMemo, useCallback } from "react";
import set from "lodash.set";
import { Rating } from "react-simple-star-rating";
import { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/router";

import {
  UserBook,
  UserBookOrderByWithRelationInput,
  UserBookWhereInput,
} from "~/prisma/generated/type-graphql";

import { useUserBooks } from "~/hooks/user-books";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { DataTable } from "./data-table";

export const columns: ColumnDef<UserBook>[] = [
  {
    accessorKey: "book.title",
    header: ({ column }) => {
      const sortIcon =
        column.getIsSorted() === "asc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUp className="ml-2 h-4 w-4" />
        );
      return (
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 pb-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            {column.getIsSorted() && sortIcon}
          </Button>
          <Input
            placeholder="Filter"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-6 mb-1 w-40 p-1"
          />
        </div>
      );
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
      );
    },
  },
  {
    accessorKey: "book.author",
    header: "Author",
    meta: { className: "hidden sm:table-cell capitalize" },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      const sortIcon =
        column.getIsSorted() === "asc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUp className="ml-2 h-4 w-4" />
        );
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {column.getIsSorted() && sortIcon}
        </Button>
      );
    },
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => {
      return new Date(row.original.date).toLocaleDateString();
    },
  },
];

export const BooksTable = (opts: { status: "READ" | "READING" | "TO_READ" }) => {
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [filteringState, setFilteringState] = useState<ColumnFiltersState>([]);
  const router = useRouter();

  const order = sortingState.map((sort) => {
    return set<UserBookOrderByWithRelationInput>(
      {},
      sort.id.split("_"),
      sort.desc ? "desc" : "asc",
    );
  }) as UserBookOrderByWithRelationInput[];

  const where = filteringState.reduce((acc, filter) => {
    if (typeof filter.value === "string") {
      return set<UserBookWhereInput>(
        acc,
        filter.id.replace("_", "_is_").split("_").concat("contains"),
        filter.value,
      );
    }
    return acc;
  }, {}) as UserBookWhereInput;

  const { books, loading, finishBook, loadNext, loadPrev } = useUserBooks({
    userId: 1,
    order,
    where,
    status: opts.status,
  });

  const [finishBookId, setFinishBookId] = useState<UserBook["id"] | null>(null);
  const onFinish = (bookId: UserBook["id"]) => {
    setFinishBookId(bookId);
  };

  const tableColumns = useMemo(() => {
    if (opts.status === "READ") return columns;
    return columns.concat({
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button size="sm" onClick={() => onFinish(row.original.id)}>
            Finish
          </Button>
        );
      },
    });
  }, [opts.status]);

  const [rating, setRating] = useState<number>(0);

  const onClose = useCallback(() => {
    setFinishBookId(null);
  }, []);

  return (
    <>
      {!!finishBookId && (
        <Dialog open onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rate</DialogTitle>
            </DialogHeader>
            <Rating onClick={setRating} />
            <DialogFooter>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Ok
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <DataTable
        columns={tableColumns}
        data={books}
        onAdd={() => router.push("add")}
        onFiltering={setFilteringState}
        onSorting={setSortingState}
        onNextPage={loadNext}
        onPrevPage={loadPrev}
      />
    </>
  );
};