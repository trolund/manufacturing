import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UseQueryResult } from "@tanstack/react-query";
import { Paginated } from "../models/Paginated";

type TableProps<T extends unknown> = {
  searchTerm?: string;
  data?: T[];
  columns: ColumnDef<T>[];
  defSortOrderKey?: string;
  onRowClick?: (item: T) => void;
  dataFetcher?: (
    searchTerm: string,
    pageNumber?: number,
    pageSize?: number,
    sortOrderKey?: string
  ) => UseQueryResult<Paginated<T>, Error>;
};

export const Table = <T extends unknown>({
  columns,
  searchTerm: query,
  defSortOrderKey,
  onRowClick,
  dataFetcher,
}: TableProps<T>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sortOrderKey, setSortOrderKey] = useState(defSortOrderKey);
  const [searchTerm, setSearchTerm] = useState(query);

  const {
    data: tableData,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = dataFetcher
    ? dataFetcher(
        searchTerm ?? "",
        pagination.pageIndex + 1,
        pagination.pageSize,
        sortOrderKey
      )
    : {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: false,
        refetch: () => {},
      };

  const defaultData = useMemo(() => [], []);

  const table = useReactTable<T>({
    data: tableData?.items ?? defaultData,
    columns,
    pageCount: tableData?.numberOfPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //we're doing manual "server-side" pagination
    debugTable: false,
  });

  // delay search so we do not overwhelm the backend
  useEffect(() => {
    const timeOutId = setTimeout(() => setSearchTerm(query), 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  // refetch when sort key is set
  useEffect(() => {
    if (sortOrderKey && sortOrderKey.length > 0) {
      refetch();
    }
  }, [sortOrderKey]);

  const getSortSymbol = useMemo(
    () => (rowKey: string, key: string | undefined) => {
      if (!key) return "";
      if (rowKey === key) return "↑";
      if (rowKey + "_desc" == key) return "↓";
      return "";
    },
    []
  );

  return (
    <div className="w-full border rounded-2xl">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="w-full border-b p-5 border-solid"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={() =>
                      header.id === sortOrderKey
                        ? setSortOrderKey(header.id + "_desc")
                        : setSortOrderKey(header.id)
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {getSortSymbol(header.id, sortOrderKey)}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className={
                  "w-full border-b p-5 border-dashed odd:bg-white even:bg-slate-50 hover:bg-slate-200 " +
                  (onRowClick ? " cursor-pointer" : "")
                }
                onClick={() => onRowClick && onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            placeholder="0"
            type="number"
            min={1}
            max={tableData?.numberOfPages}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          title="selectPage"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <button
          className="border rounded p-1 float-right"
          onClick={() => refetch()}
        >
          {"Refetch"}
        </button>
        {isError && `Error fetching data`}
        {isSuccess && `Found ${tableData?.totalCount} items`}
        {isFetching || (isLoading && "Loading...")}
      </div>
    </div>
  );
};
