"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ParsedData {
  id: number;
  source: string;
  target: string;
  value: number;
  duration: number;
  timestamp: string;
}

interface FileUploaderProps {
  onDataUpload: (data: ParsedData[]) => void; // Update the type for the uploaded data
}

export default function FileUploader({ onDataUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let parsedData: ParsedData[] = [];

      if (file.name.endsWith(".json")) {
        parsedData = JSON.parse(content);
      }

      if (parsedData) {
        onDataUpload(parsedData); // Ensure data is passed in the correct type
      }
    };

    if (file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Input type="file" accept=".csv,.json" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        <Upload className="mr-2 h-4 w-4" /> Upload
      </Button>
    </div>
  );
}
