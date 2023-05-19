import { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAdd: () => void;
  onSorting: (sorting: SortingState) => void;
  onFiltering: (columnFilters: ColumnFiltersState) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData, TValue> {
    className: string;
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAdd,
  onFiltering,
  onSorting,
  onNextPage,
  onPrevPage,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "book_title", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    onSorting(sorting);
  }, [sorting]);

  useEffect(() => {
    onFiltering(columnFilters);
  }, [columnFilters]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.columnDef.meta?.className}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <Button variant="fab" className="w-10 p-3 absolute max-sm:right-2 sm:relative">
          <PlusIcon className="h-6 w-6" onClick={onAdd} />
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onPrevPage}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
