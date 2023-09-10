import { useState, useMemo } from "react";
import set from "lodash.set";
import { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, EyeIcon, XCircleIcon, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Prisma } from "@prisma/client";


import { UserBookBook, useUserBooks } from "~/hooks/user-books";
import { useAuth } from "~/hooks/auth";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DataTable } from "~/components/data-table";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

export const columns: ColumnDef<UserBookBook>[] = [
  {
    accessorKey: "book.title",
    header: ({ column }) => {
      /* eslint-disable react-hooks/rules-of-hooks */
      const { t } = useTranslation();
      const sortIcon =
        column.getIsSorted() === "asc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUp className="ml-2 h-4 w-4" />
        );
      return (
        <div>
          <Button
            data-testid={column.id}
            variant="ghost"
            size="sm"
            className="p-1 pb-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("Title")}
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
      /* eslint-disable react-hooks/rules-of-hooks */
      const { t } = useTranslation();
      return (
        <div className="text-left capitalize">
          <h5>{row.original.book?.title}</h5>
          <div className="flex sm:hidden justify-between items-center text-muted-foreground mt-2">
            <div className="text-sm">
              {t("Author")}: {row.original.book?.author}
            </div>
            <div className="text-xs">
              {t("Date")}: {new Date(row.original.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "book.author",
    header: () => {
      /* eslint-disable react-hooks/rules-of-hooks */
      const { t } = useTranslation();
      return t("Author");
    },
    meta: { className: "hidden sm:table-cell capitalize w-56" },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      /* eslint-disable react-hooks/rules-of-hooks */
      const { t } = useTranslation();
      const [showCalendar, setShowCalendar] = useState(false);
      const sortIcon =
        column.getIsSorted() === "asc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUp className="ml-2 h-4 w-4" />
        );
      return (
        <div>
          <Button
            data-testid={column.id}
            variant="ghost"
            className="p-1 pb-0"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("Date")}
            {column.getIsSorted() && sortIcon}
          </Button>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <div className="flex items-center pl-1 w-32 whitespace-nowrap cursor-pointer">
              <PopoverTrigger asChild>
                <span className="text-xs text-muted-foreground">
                  {column.getFilterValue() ? (
                    (column.getFilterValue() as Date).toDateString()
                  ) : (
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  )}
                </span>
              </PopoverTrigger>
              {!!column.getFilterValue() && (
                <XCircleIcon className="ml-2 h-3 w-3" onClick={() => column.setFilterValue(null)} />
              )}
            </div>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={column.getFilterValue() as Date}
                onSelect={(date) => {
                  setShowCalendar(false);
                  column.setFilterValue(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    meta: { className: "hidden sm:table-cell w-32" },
    cell: ({ row }) => {
      return new Date(row.original.date).toLocaleDateString();
    },
  },
];

export const BooksTable = (opts: { status: "READ" | "READING" | "TO_READ"; pageSize?: number }) => {
  const [sortingState, setSortingState] = useState<SortingState>([
    { id: "book_title", desc: false },
  ]);
  const [filteringState, setFilteringState] = useState<ColumnFiltersState>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const order = sortingState.map((sort) => {
    return set<Prisma.UserBookOrderByWithRelationInput>(
      {},
      sort.id.split("_"),
      sort.desc ? "desc" : "asc",
    );
  });

  const where = filteringState.reduce((acc, filter) => {
    if (typeof filter.value === "string") {
      return set<Prisma.UserBookWhereInput>(
        acc,
        filter.id.replace("_", "_is_").split("_").concat("contains"),
        filter.value,
      );
    }
    if (filter.value instanceof Date) {
      return set<Prisma.UserBookWhereInput>(acc, filter.id.replace("_", "_is_").split("_").concat("in"), [
        filter.value,
        new Date(filter.value.getTime() + 24 * 60 * 60 * 1000),
      ]);
    }
    return acc;
  }, {}) as Prisma.UserBookWhereInput;

  // const { user } = useAuth();

  const { books, loading, loadNext, loadPrev } = useUserBooks({
    pageSize: opts.pageSize,
    userId: 1,
    order,
    where,
    status: opts.status,
  });

  const tableColumns = useMemo(() => {
    return columns.concat({
      header: t("Actions"),
      cell: ({ row }) => {
        return (
          <Button
            data-testid="edit"
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/edit/${row.original.id}`)}
          >
            <EyeIcon className="w-5" />
          </Button>
        );
      },
    });
  }, [t, opts.status]);

  return (
    <DataTable
      columns={tableColumns}
      data={books}
      loading={loading}
      initialSort={sortingState}
      onAdd={() => navigate("/add")}
      onFiltering={setFilteringState}
      onSorting={setSortingState}
      onNextPage={loadNext}
      onPrevPage={loadPrev}
    />
  );
};
