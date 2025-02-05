"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecentStreamsData } from "./types";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const columns: ColumnDef<RecentStreamsData>[] = [
  {
    accessorKey: "songName",
    header: "Song Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("songName")}</div>
    ),
    enableSorting: false,
    filterFn: (row, _, filterValues) => {
      const info = [
        row.original.artist.toLowerCase(),
        row.original.songName.toLowerCase(),
      ]
        .filter(Boolean)
        .join(" ");

      let searchTerms = Array.isArray(filterValues)
        ? filterValues
        : [filterValues];
      return searchTerms.some((term) => {
        return info.includes(term.toLowerCase());
      });
    },
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("artist")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "dateStreamed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Streamed
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {moment(row.getValue("dateStreamed")).format("DD MMM, YYYY")}
      </div>
    ),
  },
  {
    accessorKey: "streamCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stream Count
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("streamCount")}</div>,
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => <div>{row.getValue("userId")}</div>,
    enableSorting: false,
  },
];

const fetchData = async () => {
  const response = await fetch("/api/recent-streams");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const DataTable: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}) => {
  const { data, isLoading, error } = useQuery<RecentStreamsData[]>({
    queryKey: ["recentStreams"],
    queryFn: fetchData,
    initialData: [],
    refetchOnMount: true,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <></>;
  if (error)
    return <div>An error has occurred: {(error as Error).message}</div>;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Streams</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`w-full ${className}`}>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by song or artist"
              value={
                (table.getColumn("songName")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("songName")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
