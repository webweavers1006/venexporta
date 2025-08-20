"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table"
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function SubSectoresTable({ data }) {
SubSectoresTable.propTypes = {
  data: PropTypes.array.isRequired,
}
  const columns = React.useMemo(
    () => [
      {
        id: "badge",
        header: "",
        cell: ({ row }) => {
          const color = row.original.fill || row.original.color || "#eee";
          return (
            <span
              style={{
                display: "inline-block",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: color,
                marginRight: 8,
                border: "1px solid #e5e7eb"
              }}
              title={row.original.sub_sector_productivo}
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "sub_sector_productivo",
        header: "Sub Sector Productivo",
        cell: ({ row }) => {
          const value = row.getValue("sub_sector_productivo") || "";
          const maxLength = 32;
          const isLong = value.length > maxLength;
          const display = isLong ? value.slice(0, maxLength) + "..." : value;
          return (
            <span title={isLong ? value : undefined} style={{ cursor: isLong ? 'pointer' : undefined }}>
              {display}
            </span>
          );
        },
      },
      {
        accessorKey: "total",
        header: ({ column }) => {
          // Iconos simples de flecha para orden asc/desc
          const isSorted = column.getIsSorted();
          const iconStyle = { fontSize: 13, color: '#9ca3af' };
          return (
            <div className="flex items-center justify-end gap-1 select-none cursor-pointer" onClick={column.getToggleSortingHandler()}>
              <span>Total Empresas</span>
              {isSorted === 'desc' && <span title="Orden descendente" style={iconStyle}>▼</span>}
              {isSorted === 'asc' && <span title="Orden ascendente" style={iconStyle}>▲</span>}
              {!isSorted && <span style={{...iconStyle, opacity:0.3}}>▲</span>}
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-right font-medium">{row.getValue("total")}</div>
        ),
        enableSorting: true,
      },
    ],
    []
  )

  const [sorting, setSorting] = React.useState([
    { id: 'total', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data || [],
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
  })

  // Título: nombre y color del sub sector seleccionado (primer elemento de data)
  const selectedSubSector = data && data.length > 0 ? data[0] : null;
  return (
    <div className="w-full bg-white  rounded-2xl p-4 mt-4">
      {selectedSubSector && (
        <div className="flex flex-col items-center mb-4">
          <span
            className="text-lg font-bold text-gray-700"
            // color fijo gris
          >
            {selectedSubSector.sub_sector_productivo}
          </span>
          <span
            style={{
              display: 'inline-block',
              width: 56,
              height: 24,
              borderRadius: 12,
              background: selectedSubSector.fill || selectedSubSector.color || '#eee',
              marginTop: 8,
              border: '2px solid #e5e7eb',
            }}
            title="Color del subsector"
          />
        </div>
      )}
      <div className="flex items-center py-2">
        <Input
          placeholder="Filtrar por sub sector..."
          value={table.getColumn("sub_sector_productivo")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("sub_sector_productivo")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="!bg-green !text-primary font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
