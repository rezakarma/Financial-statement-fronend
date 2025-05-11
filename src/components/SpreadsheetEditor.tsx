"use client";

import { useEffect, useRef, useState } from "react";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
// Correct imports from CORE package
import {
  Column,
  Row,
  Cell,
  Sheet,
  Open,
  Save,
  Formula,
  Sort,
  Filter,
  Selection,
  ProtectSheet,
} from "@syncfusion/ej2-spreadsheet"; // Changed import source
import { Inject } from "@syncfusion/ej2-react-base";
import dynamic from "next/dynamic";

const Spreadsheet = dynamic(
  () =>
    import("@syncfusion/ej2-react-spreadsheet").then(
      (mod) => mod.SpreadsheetComponent
    ),
  { ssr: false, loading: () => <div>Loading Spreadsheet...</div> }
);

export default function EditableSpreadsheet() {
  const spreadsheetRef = useRef<SpreadsheetComponent>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch("/api/load-excel");
        if (!response.ok) throw new Error("Failed to load file");

        const arrayBuffer = await response.arrayBuffer();
        const file = new File([arrayBuffer], "spreadsheet.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        if (spreadsheetRef.current) {
          // Initialize with empty data first
          spreadsheetRef.current.open({ file });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load spreadsheet"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSave = async () => {
    try {
      if (!spreadsheetRef.current) return;

      const spreadsheet = spreadsheetRef.current;
      const result = await spreadsheet.save({
        saveType: "Xlsx",
        fileName: "modified-file",
      });

      console.log(spreadsheet, "spreadsheet");
      //   if (result instanceof Blob) {
      //     const formData = new FormData();
      //     formData.append('file', result, 'modified.xlsx');

      //     const response = await fetch('/api/excel-file', {
      //       method: 'PUT',
      //       body: formData,
      //     });

      //     if (!response.ok) throw new Error('Save failed');
      //     alert('File saved successfully!');
      //   }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving file");
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="h-[80vh] w-full">
      <button
        onClick={handleSave}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Changes
      </button>

      {!isLoading && (
        <Spreadsheet
          ref={spreadsheetRef}
          allowOpen={true}
          allowSave={true}
          allowEditing={true}
          openUrl=""
          saveUrl=""
        >
          <Inject
            services={[
              Sheet,
              Row,
              Column,
              Cell,
              Open,
              Save,
              Formula,
              Sort,
              Filter,
              Selection,
              ProtectSheet,
            ]}
          />
        </Spreadsheet>
      )}
    </div>
  );
}
