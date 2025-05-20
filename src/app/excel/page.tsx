"use client";
// import XspreadSheet from "@/components/x-spreadsheet";
// import dynamic from "next/dynamic";
// import { useState } from "react";

// // Dynamically import the ExcelSpreadsheet component with no SSR
// const ExcelSpreadsheet = dynamic(
//   () => import("../../components/SpreadsheetEditor"),
//   { ssr: false }
// );

// export default function Home() {
//   const [spreadsheetData, setSpreadsheetData] = useState<any>(null);

//   const handleDataChange = (newData: any) => {
//     setSpreadsheetData(newData);
//     console.log("Spreadsheet data updated:", newData);
//   };

//   // Example of initial data with some content
//   const initialData = {
//     sheets: [
//       {
//         id: "Sheet1",
//         name: "Sheet1",
//         cells: {
//           A1: { content: "Welcome to Excel Spreadsheet" },
//           A2: { content: "This is a sample spreadsheet" },
//           A4: { content: "=SUM(B4:B6)" },
//           B4: { content: "10" },
//           B5: { content: "20" },
//           B6: { content: "30" },
//         },
//         colNumber: 26,
//         rowNumber: 100,
//         merges: [],
//         borders: {},
//         figures: [],
//         filterTables: [],
//         conditionalFormats: [],
//         charts: [],
//         images: [],
//         nameBoxes: [],
//       },
//     ],
//     revisionId: "START",
//     version: "1.0",
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Excel Spreadsheet Example</h1>
//       <div style={{ height: "600px", width: "100%" }}>
//         {/* <ExcelSpreadsheet
//           initialData={initialData}
//           onDataChange={handleDataChange}
//           height="100%"
//           width="100%"
//         />
//          */}
//         <XspreadSheet />
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
// import dynamic from "next/dynamic";

// Dynamically load the spreadsheet component with SSR disabled
// const DynamicSpreadsheet = dynamic(() => import("@/components/x-spreadsheet"), {
//   ssr: false,
//   loading: () => <div>Loading spreadsheet...</div>,
// });

// export default function ExcelPage() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Excel Spreadsheet Example</h1>
//       <div style={{ height: "600px", width: "100%" }}>
//         <DynamicSpreadsheet />
//       </div>
//     </div>
//   );
// }

// Add this to your component for file upload

// import { useState } from 'react';
import dynamic from "next/dynamic";
import Fortuneexcel from "@/components/fortuneexcel";

const DynamicSpreadsheet = dynamic(() => import("@/components/x-spreadsheet"), {
  ssr: false,
  loading: () => <div>Loading spreadsheet...</div>,
});

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
