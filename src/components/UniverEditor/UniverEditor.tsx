// "use client";
// import { useEffect, useRef } from "react";
// import { Univer } from "@univerjs/core";
// import { ThemeManager } from "@univerjs/core";
// import { defaultTheme } from "@univerjs/design";
// import { UniverDocsPlugin } from "@univerjs/docs";
// import { UniverSheetsPlugin } from "@univerjs/sheets";
// import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
// import { UniverRenderEnginePlugin } from "@univerjs/engine-render"; // Add this
// import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula"; // Add this
// import { UniverUIPlugin } from "@univerjs/ui";
// import { FUniver } from "@univerjs/facade";
// interface UniverEditorProps {
//   initialData: any;
//   onSave: (data: any) => void;
// }

// export default function UniverEditor({
//   initialData,
//   onSave,
// }: UniverEditorProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const univerRef = useRef<typeof Univer | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined" && containerRef.current) {
//       const univer = new Univer({
//         theme: defaultTheme, // Or themes.DARK
//       });

//       univer.registerPlugin(
//         UniverRenderEnginePlugin,
//         UniverFormulaEnginePlugin,
//         UniverUIPlugin, // Add this
//         UniverSheetsPlugin,
//         UniverSheetsUIPlugin,
//         UniverDocsPlugin
//       );

//       // Create workbook
//       const workbook = univer.createUniverWorkbook(initialData);
//       const univerAPI = FUniver.newAPI(univer);

//       univerAPI.onSheetRenderCreated((sheetRender) => {
//         sheetRender.mount(containerRef.current!);
//       });
//       // Force render update
//       // univer.getCurrentUniverSheetInstance().getEngine().resize();

//       univerRef.current = univer;
//       return () => {
//         univer.dispose();
//       };
//     }
//   }, [initialData]);
//   const handleSave = () => {
//     if (univerRef.current) {
//       const workbook = univerRef.current.getCurrentUniverSheetInstance();
//       const snapshot = workbook.getSnapshot();
//       onSave(snapshot);
//     }
//   };

//   return (
//     <div>
//       <div ref={containerRef} style={{ height: "80vh", width: "100%" }} />
//       <button onClick={handleSave} className="save-button">
//         Save Changes
//       </button>
//     </div>
//   );
// }

// components/UniverEditor.tsx
// components/UniverEditor.tsx
"use client";
import { useEffect, useRef } from "react";
import { Univer } from "@univerjs/core";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverUIPlugin } from "@univerjs/ui";
import { FUniver } from "@univerjs/facade";
// import { ThemeManager, defaultTheme } from "@univerjs/design";

interface UniverEditorProps {
  initialData: any;
  onSave: (data: any) => void;
}

export default function UniverEditor({
  initialData,
  onSave,
}: UniverEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerInstance = useRef<typeof Univer | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    // Initialize Univer once
    if (!univerInstance.current) {
      const univer = new Univer();

      // Register plugins in correct order
      univer.registerPlugin(
        UniverRenderEnginePlugin,
        UniverFormulaEnginePlugin,
        UniverUIPlugin,
        UniverSheetsPlugin,
        UniverSheetsUIPlugin,
        UniverDocsPlugin
      );

      // Create workbook
      const workbook = univer.createUniverWorkbook(initialData);

      // Initialize facade API
      const univerAPI = FUniver.newAPI(univer);

      // Mount the sheet
      univerAPI.onSheetRenderCreated((sheetRender: any) => {
        sheetRender.mount(containerRef.current!);
      });

      univerInstance.current = univer;
    }

    return () => {
      univerInstance.current?.dispose();
      univerInstance.current = null;
    };
  }, [initialData]);

  const handleSave = () => {
    if (univerInstance.current) {
      const workbook = univerInstance.current.getCurrentUniverSheetInstance();
      onSave(workbook.getSnapshot());
    }
  };

  return (
    <div className="univer-container">
      <div ref={containerRef} style={{ height: "80vh", width: "100%" }} />
      <button onClick={handleSave} className="save-button">
        Save Changes
      </button>
    </div>
  );
}
