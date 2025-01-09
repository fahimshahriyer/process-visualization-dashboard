"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RowData {
  id: number;
  source: string;
  target: string;
  value: number;
  duration: number;
  timestamp: string;
}

interface DataTableProps {
  data: RowData[]; // Define data as an array of RowData objects
}

export default function DataTable({ data }: DataTableProps) {
  const headers = Object.keys(data[0] || {});

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <TableCell key={header}>{(row as any)[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
