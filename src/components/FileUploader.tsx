"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  onDataUpload: (data: any[]) => void;
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
      let parsedData;

      if (file.name.endsWith(".json")) {
        parsedData = JSON.parse(content);
      } else if (file.name.endsWith(".csv")) {
        parsedData = parseCSV(content);
      }

      if (parsedData) {
        onDataUpload(parsedData);
      }
    };

    if (file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    }
  };

  const parseCSV = (content: string): any[] => {
    const lines = content.split("\n");
    const headers = lines[0].split(",");
    return lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj: any, header, index) => {
        obj[header.trim()] = values[index].trim();
        return obj;
      }, {});
    });
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
