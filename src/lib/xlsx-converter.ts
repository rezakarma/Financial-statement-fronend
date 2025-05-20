import { WorkBook, utils } from "xlsx";

export interface SpreadsheetCell {
  text: string;
  style?: number;
}

export interface SpreadsheetSheet {
  name: string;
  rows: {
    [key: number]: {
      cells: {
        [key: number]: SpreadsheetCell;
      };
    };
  };
  cols?: { len?: number }[];
  merges?: string[];
}
interface HyperlinkInfo {
  target: string;
  display: string;
}

export interface SpreadsheetCell {
  text: string;
  hyperlink?: HyperlinkInfo;
  style?: number;
}

export function convertXLSXToSpreadsheetData(
  workbook: WorkBook
): SpreadsheetSheet[] {
  return workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    // const jsonData: any[][] = utils.sheet_to_json(worksheet, {
    //   header: 1,
    //   blankrows: true,
    //   defval: ""
    // });

    const rows: any = {};
    const merges: string[] = [];

     const cellRefs = Object.keys(worksheet).filter(key => key[0] !== '!');

     cellRefs.forEach(cellAddress => {
      const cell = worksheet[cellAddress];
      const { r: rowIndex, c: colIndex } = utils.decode_cell(cellAddress);
      
      if (!rows[rowIndex]) {
        rows[rowIndex] = { cells: {} };
      }

      let cellText = '';
      let hyperlink: HyperlinkInfo | undefined;

      // Handle hyperlink formulas
      if (cell.f && cell.f.startsWith('HYPERLINK(')) {
        const match = cell.f.match(/HYPERLINK\(["']#([^'"]+)["']\s*,\s*["']([^'"]+)["']\)/i);
        if (match) {
          hyperlink = {
            target: match[1], // Sheet2!A1 format
            display: match[2]
          };
          cellText = match[2];
        }
      } else {
        cellText = cell.w || cell.v?.toString() || '';
      }

      rows[rowIndex].cells[colIndex] = {
        text: cellText.trim(),
        ...(hyperlink && { hyperlink })
      };
    });

    // jsonData.forEach((row, rowIndex) => {
    //   rows[rowIndex] = {
    //     cells: {},
    //   };

    //   row.forEach((cellValue, colIndex) => {
    //     if (cellValue !== null && cellValue !== undefined && cellValue !== "") {
    //       rows[rowIndex].cells[colIndex] = {
    //         text: cellValue.toString().trim(),
    //       };
    //     }
    //   });
    // });

    // Handle merged cells
    // const merges: string[] = [];
    if (worksheet["!merges"]) {
      worksheet["!merges"].forEach((merge) => {
        merges.push(`${merge.s.r}:${merge.s.c}-${merge.e.r}:${merge.e.c}`);
      });
    }

    return {
      name: sheetName,
      rows,
      cols: Array.from({ length: 26 }, () => ({ len: 120 })),
      merges,
    };
  });
}
