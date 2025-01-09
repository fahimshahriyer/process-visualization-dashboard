"use client";

import { ResponsiveContainer, Sankey, Tooltip, Label } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProcessFlowChartProps {
  data: { source: string; target: string; value: number }[]; // Define expected data structure
}

export default function ProcessFlowChart({ data }: ProcessFlowChartProps) {
  const { nodes, links, error } = transformDataForSankey(data);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (nodes.length === 0 || links.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          There is not enough data to generate a process flow chart.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Sankey
        data={{ nodes, links }}
        nodePadding={50}
        nodeWidth={10}
        linkCurvature={0.5}
        iterations={64}
      >
        <Tooltip />
        {nodes.map((node, index) => (
          <Label
            key={index}
            position="center"
            fill="#000"
            value={node.name}
            fontSize={12}
          />
        ))}
      </Sankey>
    </ResponsiveContainer>
  );
}

function transformDataForSankey(
  data: { source: string; target: string; value: number }[]
) {
  try {
    const nodeMap = new Map<string, number>();
    const links: { source: number; target: number; value: number }[] = [];

    data.forEach((item) => {
      if (typeof item.source !== "string" || typeof item.target !== "string") {
        throw new Error(
          "Invalid data format: source and target must be strings"
        );
      }

      if (!nodeMap.has(item.source)) {
        nodeMap.set(item.source, nodeMap.size);
      }
      if (!nodeMap.has(item.target)) {
        nodeMap.set(item.target, nodeMap.size);
      }

      const sourceIndex = nodeMap.get(item.source)!;
      const targetIndex = nodeMap.get(item.target)!;

      const existingLink = links.find(
        (link) => link.source === sourceIndex && link.target === targetIndex
      );

      if (existingLink) {
        // Increment the value based on the 'value' in the data
        existingLink.value += item.value;
      } else {
        links.push({
          source: sourceIndex,
          target: targetIndex,
          value: item.value, // Use the actual value from the data
        });
      }
    });

    const nodes = Array.from(nodeMap.entries()).map(([name, index]) => ({
      name,
      index,
    }));

    return { nodes, links, error: null };
  } catch (err) {
    console.error("Error transforming data for Sankey diagram:", err);
    return {
      nodes: [],
      links: [],
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
}
