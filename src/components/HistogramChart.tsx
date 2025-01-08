"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface HistogramChartProps {
  data: any[];
}

export default function HistogramChart({ data }: HistogramChartProps) {
  const { histogramData, error } = transformDataForHistogram(data);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (histogramData.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          There is not enough data to generate a histogram.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={histogramData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function transformDataForHistogram(data: any[]) {
  try {
    const durations = data.map((item) => {
      const duration = parseFloat(item.duration);
      if (isNaN(duration)) {
        throw new Error("Invalid duration value");
      }
      return duration;
    });

    if (durations.length === 0) {
      return { histogramData: [], error: null };
    }

    const min = Math.min(...durations);
    const max = Math.max(...durations);
    const range = max - min;
    const binCount = 10;
    const binSize = range / binCount;

    const bins = Array(binCount).fill(0);

    durations.forEach((duration) => {
      const binIndex = Math.min(
        Math.floor((duration - min) / binSize),
        binCount - 1
      );
      bins[binIndex]++;
    });

    const histogramData = bins.map((count, index) => ({
      range: `${(min + index * binSize).toFixed(2)} - ${(
        min +
        (index + 1) * binSize
      ).toFixed(2)}`,
      count,
    }));

    return { histogramData, error: null };
  } catch (err) {
    console.error("Error transforming data for histogram:", err);
    return {
      histogramData: [],
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
}
