"use client";
import { useEffect, useRef } from "react";
import { Univer } from "@univerjs/core";
import { ThemeManager } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import type { IUniver } from "@univerjs/core";
interface UniverEditorProps {
  initialData: any;
  onSave: (data: any) => void;
}

export default function UniverEditor({
  initialData,
  onSave,
}: UniverEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<typeof Univer | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      const univer = new Univer({
        theme: defaultTheme, // Or themes.DARK
      });

      // Register plugins
      univer.registerPlugin(UniverDocsPlugin);
      univer.registerPlugin(UniverSheetsPlugin);
      univer.registerPlugin(UniverSheetsUIPlugin);

      // Create workbook
      const workbook = univer.createUniverSheet(initialData);

      univerRef.current = univer;

      return () => {
        univer.dispose();
      };
    }
  }, [initialData]);

  const handleSave = () => {
    if (univerRef.current) {
      const workbook = univerRef.current.getCurrentUniverSheetInstance();
      const snapshot = workbook.getSnapshot();
      onSave(snapshot);
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ height: "80vh", width: "100%" }} />
      <button onClick={handleSave} className="save-button">
        Save Changes
      </button>
    </div>
  );
}
