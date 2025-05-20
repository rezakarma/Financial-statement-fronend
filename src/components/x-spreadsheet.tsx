"use client";
// components/x-spreadsheet.tsx
import { useEffect, useState } from "react";
import Spreadsheet from "x-data-spreadsheet";

// Force import compiled CSS
import "!!style-loader!css-loader!x-data-spreadsheet/dist/xspreadsheet.css";
import { convertXLSXToSpreadsheetData } from "@/lib/xlsx-converter";
import { read } from "xlsx";
interface XSpreadSheetProps {
  xlsxFile?: File;
  initialData?: unknown;
}

const XspreadSheet = ({ initialData, xlsxFile }: XSpreadSheetProps) => {
  //   useEffect(() => {
  //     const container = document.getElementById("x-spreadsheet-root");
  //     if (!container) return;

  //     const s = new Spreadsheet(container, {
  //       mode: "edit",
  //       showToolbar: true,
  //       showGrid: true,
  //       showBottomBar: true,
  //       showContextmenu: true,
  //       row: {
  //         len: 100,
  //         height: 25,
  //       },
  //     });

  //     // Cleanup
  //     return () => {
  //       if (s) {
  //         s.deleteSheet();
  //         container.innerHTML = "";
  //       }
  //     };
  //   }, []);

  const [spreadsheet, setSpreadsheet] = useState<any>(null);
  const [sheetData, setSheetData] = useState<any>(initialData);
  // Load and parse XLSX file
  // useEffect(() => {
  //   const processFile = async (file: File) => {
  //     try {
  //       const reader = new FileReader();

  //       reader.onload = (e) => {
  //         const arrayBuffer = e.target?.result;
  //         if (!arrayBuffer) return;

  //         const workbook = read(new Uint8Array(arrayBuffer as ArrayBuffer), {
  //           type: "array",
  //         });
  //         const convertedData = convertXLSXToSpreadsheetData(workbook);

  //         setSheetData({
  //           sheets: convertedData,
  //           revisionId: "INITIAL",
  //           version: "1.0",
  //         });
  //       };

  //       reader.readAsArrayBuffer(file);
  //     } catch (error) {
  //       console.error("Error processing file:", error);
  //     }
  //   };

  //   if (xlsxFile) {
  //     processFile(xlsxFile);
  //   }
  // }, [xlsxFile]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const processFile = async (file: File) => {
    //   setLoading(true);
    //   try {
    //     const reader = new FileReader();

    //     reader.onload = (e) => {
    //       const arrayBuffer = e.target?.result;
    //       if (!arrayBuffer) return;

    //       const workbook = read(new Uint8Array(arrayBuffer as ArrayBuffer), {
    //         type: "array",
    //         cellText: false,
    //         cellDates: true,
    //       });

    //       const convertedData = convertXLSXToSpreadsheetData(workbook);
    //       setSheetData(convertedData);
    //     };

    //     reader.readAsArrayBuffer(file);
    //   } catch (error) {
    //     console.error("Error processing file:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const processFile = async (file: File) => {
      setLoading(true);
      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          const arrayBuffer = e.target?.result;
          if (!arrayBuffer) return;

          const workbook = read(new Uint8Array(arrayBuffer as ArrayBuffer), {
            type: "array",
            cellText: false,
            cellDates: true,
          });

          const convertedData = convertXLSXToSpreadsheetData(workbook);
          setSheetData(convertedData);
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        setLoading(false);
      }
    };

    if (xlsxFile) processFile(xlsxFile);
  }, [xlsxFile]);

  // Initialize/update spreadsheet
  useEffect(() => {
    if (!sheetData) return;

    const container = document.getElementById("x-spreadsheet-root");
    if (!container) return;

    // Destroy existing instance
    if (spreadsheet) {
      spreadsheet.deleteSheet();
      container.innerHTML = "";
    }

    // Create new instance with updated data
    const s = new Spreadsheet(container, {
      mode: "edit",
      showToolbar: true,
      showGrid: true,
      showContextmenu: true,
      showBottomBar: true,
      view: {
        height: () => container.clientHeight,
        width: () => container.clientWidth,
      },
    });
    console.log(sheetData, " sheetData");
    // s.loadData(sheetData);
    setTimeout(() => {
      try {
        s.loadData(sheetData);
        s.change((data) => {
          console.log("Spreadsheet data loaded:", data);
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }, 100);

    s.on("cell-selected", (celll, rowIndex, colIndex) => {
      //@ts-ignore
      const index = s.datas.findIndex((item) => item.name === s.data.name);
      //@ts-ignore
      console.log(index, " dfsffsdsdf");
      //@ts-ignore
      console.log(s.datas, " dfsffsdsdf");
      //@ts-ignore
      console.log(s.data.name, " dfsffsdsdf");
      //  const sheetIndex = s.getActiveSheetIndex();
      // const cell = s.cell(rowIndex, colIndex,);
      // if (cell?.hyperlink) {
      //   const [targetSheet, targetCell] = cell.hyperlink.target.split("!");
      //   const sheet = s.getSheetByName(targetSheet);

      //   if (sheet) {
      //     // Switch to target sheet
      //     s.setActiveSheet(targetSheet);

      //     // Scroll to target cell
      //     if (targetCell) {
      //       const { r: targetRow, c: targetCol } =
      //         utils.decode_cell(targetCell);
      //       s.scrollToCell(targetRow, targetCol);
      //     }
      //   }
      // }
    });

    setSpreadsheet(s);

    // setTimeout(() => s.loadData(sheetData), 500);

    return () => {
      s.deleteSheet();
      container.innerHTML = "";
    };
  }, [sheetData]);

  return (
    <div style={{ position: "relative", height: "80vh" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading spreadsheet data...
        </div>
      )}

      <div
        id="x-spreadsheet-root"
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          direction: "rtl", // RTL layout
        }}
      />
    </div>
  );
};

export default XspreadSheet;
