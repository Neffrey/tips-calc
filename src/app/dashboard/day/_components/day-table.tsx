// LIBS
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

// HELPERS
import { twoDecimals } from "~/lib/utils";
import { api } from "~/trpc/react";

// COMPONENTS
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// TYPES
type DayData = {
  date: Date;
  total: number;
  hours: number;
  perHour: number;
};

// COLUMNS
export const columns: ColumnDef<DayData>[] = [
  {
    id: "date",
    header: () => {
      return <div className="w-full justify-start">Date</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="w-full justify-start">
          {row?.original?.date?.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "total",
    header: () => {
      return <div className="w-full justify-start">$</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="w-full justify-start">
          {twoDecimals(row?.original?.total)}
        </div>
      );
    },
  },
  {
    id: "hours",
    header: () => {
      return <div className="w-full justify-start">Hours</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="w-full justify-start">
          {twoDecimals(row?.original?.hours)}
        </div>
      );
    },
  },
  {
    id: "$ per hour",
    header: () => {
      return <div className="w-full justify-start">$ per hour</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="w-full justify-start">
          {twoDecimals(row?.original?.perHour)}
        </div>
      );
    },
  },
];

// COMP
const DayTable = () => {
  const tips = api.tip.findAll.useQuery();

  const table = useReactTable({
    columns,
    data:
      tips?.data?.map((tip) => {
        return {
          date: tip.date,
          total:
            tip.cardTip +
            Number(tip.cashDrawerEnd ?? 0) -
            Number(tip.cashDrawerStart ?? 0),
          hours: tip.hours,
          perHour: tip.cardTip / tip.hours,
        };
      }) ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex w-full max-w-screen-md flex-col">
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="bg-primary text-primary-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, i) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${i % 2 === 0 ? "bg-secondary/30" : "bg-secondary/50"} border-foreground/30 hover:bg-secondary`}
              >
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
                {`No tips yet :(`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          //   disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          //   disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DayTable;
