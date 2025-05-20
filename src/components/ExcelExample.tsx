import React, { useState } from "react";
import ExcelSpreadsheet from "./SpreadsheetEditor";

const ExcelExample: React.FC = () => {
  const [spreadsheetData, setSpreadsheetData] = useState<any>(null);

  const handleDataChange = (newData: any) => {
    setSpreadsheetData(newData);
    console.log("Spreadsheet data updated:", newData);
  };

  // Example of initial data with some content
  const initialData = {
    sheets: [
      {
        id: "Sheet1",
        name: "Sheet1",
        cells: {
          A1: { content: "Welcome to Excel Spreadsheet" },
          A2: { content: "This is a sample spreadsheet" },
          A4: { content: "=SUM(B4:B6)" },
          B4: { content: "10" },
          B5: { content: "20" },
          B6: { content: "30" },
        },
        colNumber: 26,
        rowNumber: 100,
        merges: [],
        borders: {},
        figures: [],
        filterTables: [],
        conditionalFormats: [],
        charts: [],
        images: [],
        nameBoxes: [],
      },
    ],
    revisionId: "START",
    version: "1.0",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Excel Spreadsheet Example</h1>
      <div style={{ height: "600px", width: "100%" }}>
        <ExcelSpreadsheet
          initialData={initialData}
          onDataChange={handleDataChange}
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default ExcelExample;
