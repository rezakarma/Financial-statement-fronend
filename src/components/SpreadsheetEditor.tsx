"use client";
import React, { useEffect, useRef, useState } from 'react';
import ScriptLoader from './ScriptLoader';
import './spreadsheet.css';

interface SpreadsheetData {
  sheets: Array<{
    id: string;
    name: string;
    cells: Record<string, { content: string }>;
    colNumber: number;
    rowNumber: number;
    merges: any[];
    borders: Record<string, any>;
    figures: any[];
    filterTables: any[];
    conditionalFormats: any[];
    charts: any[];
    images: any[];
    nameBoxes: any[];
  }>;
  revisionId: string;
  version: string;
}

interface ExcelSpreadsheetProps {
  initialData?: SpreadsheetData;
  onDataChange?: (data: SpreadsheetData) => void;
  readOnly?: boolean;
  className?: string;
  height?: string | number;
  width?: string | number;
}

declare global {
  interface Window {
    o_spreadsheet: {
      Spreadsheet: new (container: HTMLElement, options: any) => any;
    };
  }
}

const ExcelSpreadsheet: React.FC<ExcelSpreadsheetProps> = ({
  initialData,
  onDataChange,
  readOnly = false,
  className = '',
  height = '100%',
  width = '100%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spreadsheetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !isScriptLoaded) return;

    try {
      // Initialize the spreadsheet with default configuration
      const spreadsheet = new window.o_spreadsheet.Spreadsheet(containerRef.current, {
        mode: readOnly ? 'readonly' : 'edit',
        data: initialData || {
          sheets: [
            {
              id: 'Sheet1',
              name: 'Sheet1',
              cells: {},
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
          revisionId: 'START',
          version: '1.0',
        },
        onDataChange: (newData: SpreadsheetData) => {
          if (onDataChange) {
            onDataChange(newData);
          }
        },
        features: {
          cellFormatting: true,
          formulas: true,
          charts: true,
          filters: true,
          conditionalFormatting: true,
          cellMerging: true,
          cellBorders: true,
          cellColors: true,
          cellFonts: true,
          cellAlignment: true,
          cellNumberFormats: true,
        },
      });

      spreadsheetRef.current = spreadsheet;
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing spreadsheet:', error);
      setError('Failed to initialize spreadsheet');
    }

    return () => {
      if (spreadsheetRef.current) {
        spreadsheetRef.current.destroy();
      }
    };
  }, [isScriptLoaded, initialData, onDataChange, readOnly]);

  useEffect(() => {
    if (spreadsheetRef.current && initialData) {
      spreadsheetRef.current.load(initialData);
    }
  }, [initialData]);

  return (
    <ScriptLoader
      scripts={[
        {
          src: 'https://unpkg.com/@odoo/owl@2.0.0/dist/owl.js',
          id: 'owl-script',
          type: 'application/javascript'
        },
        {
          src: 'https://unpkg.com/@odoo/o-spreadsheet@18.0.28/dist/o-spreadsheet.iife.js',
          id: 'o-spreadsheet-script',
          type: 'application/javascript'
        }
      ]}
      onLoad={() => setIsScriptLoaded(true)}
      onError={(error) => {
        console.error('Script loading error:', error);
        setError('Failed to load required scripts. Please check your internet connection and try again.');
      }}
    >
      <div 
        ref={containerRef} 
        className={`excel-spreadsheet-container ${className}`}
        style={{ 
          width, 
          height, 
          minHeight: '500px',
          position: 'relative',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        {isLoading && !error && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000
          }}>
            Loading spreadsheet...
          </div>
        )}
        {error && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            color: 'red',
            zIndex: 1000,
            padding: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>
    </ScriptLoader>
  );
};

export default ExcelSpreadsheet; 