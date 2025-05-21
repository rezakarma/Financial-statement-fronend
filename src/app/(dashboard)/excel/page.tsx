"use client";

import { useState } from "react";

import dynamic from "next/dynamic";
import Fortuneexcel from "@/components/fortuneSheet/fortuneSheet";

export default function ExcelPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Excel Spreadsheet Example</h1>

      <div style={{ margin: "20px 0" }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          style={{ padding: "10px" }}
        />
      </div>

      <div style={{ height: "600px", width: "100%" }}>
        {uploadedFile ? (
          // <DynamicSpreadsheet xlsxFile={uploadedFile} />
          <Fortuneexcel />
        ) : (
          <div
            style={{
              border: "2px dashed #ccc",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>Upload an XLSX file to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
