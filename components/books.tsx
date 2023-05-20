import { useState, useMemo } from "react";
import set from "lodash.set";
import { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, EyeIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  UserBook,
  UserBookOrderByWithRelationInput,
  UserBookWhereInput,
} from "~/prisma/generated/type-graphql";

import { useUserBooks } from "~/hooks/user-books";
import { useAuth } from "~/hooks/auth";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DataTable } from "./data-table";

export const columns: ColumnDef<UserBook>[] = [
  {
    accessorKey: "book.title",
    header: ({ column }) => {
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
      const { t } = useTranslation();
      return (
        <div className="text-left capitalize">
          <h5>{row.original.book?.title}</h5>
          <div className="flex sm:hidden justify-between text-muted-foreground mt-2">
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
      const { t } = useTranslation();
      return t("Author");
    },
    meta: { className: "hidden sm:table-cell capitalize" },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      const { t } = useTranslation();
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
          {t("Date")}
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
  const { t } = useTranslation();

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

  const { user } = useAuth();

  const { books, loading, loadNext, loadPrev } = useUserBooks({
    userId: user?.id,
    order,
    where,
    status: opts.status,
  });

  const tableColumns = useMemo(() => {
    return columns.concat({
      header: t("Actions"),
      cell: ({ row }) => {
        return (
          <Button size="sm" variant="ghost" onClick={() => router.push(`/edit/${row.original.id}`)}>
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
      onAdd={() => router.push("add")}
      onFiltering={setFilteringState}
      onSorting={setSortingState}
      onNextPage={loadNext}
      onPrevPage={loadPrev}
    />
  );
};
