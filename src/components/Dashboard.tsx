"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import FileUploader from "./FileUploader";
import ProcessFlowChart from "./ProcessFLowChart";
import HistogramChart from "./HistogramChart";
import LineChart from "./LineChart";
import DataTable from "./DataTable";
import { Button } from "./ui/button";

interface ProcessData {
  id: number;
  source: string;
  target: string;
  value: number;
  duration: number;
  timestamp: string;
}

export default function Dashboard() {
  const [data, setData] = useState<ProcessData[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataUpload = (uploadedData: ProcessData[]) => {
    if (Array.isArray(uploadedData) && uploadedData.length > 0) {
      setData(uploadedData);
      setError(null);
    } else {
      setError("The uploaded file does not contain valid data.");
      setData([]);
    }
    setIsFileUploaded(true);
  };

  const handleDownloadTemplate = () => {
    // Fetch the default data (for example, from a local path or an API)
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        const file = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = "template.json";
        link.click();
      })
      .catch(() => setError("Failed to download template."));
  };

  const handleUseTemplateData = () => {
    // Fetch the default data and set it for visualization
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsFileUploaded(true);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load template data.");
      });
  };

  return (
    <div className="w-full max-w-7xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Process Visualization</CardTitle>
          <CardDescription>
            Upload your process logs and analyze the data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isFileUploaded ? (
            <>
              <FileUploader onDataUpload={handleDataUpload} />
              <Button
                onClick={handleUseTemplateData}
                variant="default"
                color="primary"
                className="mt-4"
              >
                Use Default Data
              </Button>
              <Button
                onClick={handleDownloadTemplate}
                variant="link"
                color="primary"
                className="mt-4"
              >
                Download Template
              </Button>
            </>
          ) : (
            <div>Data uploaded successfully. Visualizing your data...</div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data.length > 0 && (
        <Tabs defaultValue="flow">
          <TabsList>
            <TabsTrigger value="flow">Process Flow</TabsTrigger>
            <TabsTrigger value="histogram">Histogram</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
          </TabsList>
          <TabsContent value="flow">
            <Card>
              <CardHeader>
                <CardTitle>Process Flow Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <ProcessFlowChart data={data} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="histogram">
            <Card>
              <CardHeader>
                <CardTitle>Process Duration Histogram</CardTitle>
              </CardHeader>
              <CardContent>
                <HistogramChart data={data} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="line">
            <Card>
              <CardHeader>
                <CardTitle>Process Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={data} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Process Data</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable data={data} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
