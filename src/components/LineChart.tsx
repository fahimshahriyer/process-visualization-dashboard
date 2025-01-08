"use client";

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LineChartProps {
  data: any[];
}

export default function LineChart({ data }: LineChartProps) {
  const { chartData, error } = transformDataForLineChart(data);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (chartData.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          There is not enough data to generate a line chart.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="duration" stroke="#8884d8" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

function transformDataForLineChart(data: any[]) {
  try {
    const chartData = data
      .map((item) => {
        const timestamp = new Date(item.timestamp);
        const duration = parseFloat(item.duration);

        if (isNaN(timestamp.getTime())) {
          throw new Error("Invalid timestamp");
        }
        if (isNaN(duration)) {
          throw new Error("Invalid duration value");
        }

        return {
          timestamp: timestamp.toISOString(),
          duration,
        };
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    return { chartData, error: null };
  } catch (err) {
    console.error("Error transforming data for line chart:", err);
    return {
      chartData: [],
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
}
