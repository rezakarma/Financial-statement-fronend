// import { NextResponse } from "next/server";
// import { readFile } from "fs/promises";
// import { read, utils } from "xlsx";
// import path from "path";

// export async function GET() {
//   try {
//     // 1. Read Excel file from local storage
//     const filePath = path.join(process.cwd(), "public", "sample.xlsx");
//     const fileBuffer = await readFile(filePath);

//     // 2. Parse Excel file
//     const workbook = read(fileBuffer, { type: "buffer" });
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];

//     // 3. Convert to Univer-compatible JSON format
//     const jsonData: any[][] = utils.sheet_to_json(worksheet, { header: 1 });

//     // 4. Transform data for Univer
//     const univerData = {
//       id: "workbook-1",
//       sheets: {
//         "sheet-001": {
//           name: firstSheetName,
//           cellData: transformToUniverFormat(jsonData),
//         },
//       },
//     };

//     return NextResponse.json(univerData);
//   } catch (error) {
//     console.error("Error processing Excel file:", error);
//     return NextResponse.json(
//       { error: "Failed to process Excel file" },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to transform Excel data to Univer format
// function transformToUniverFormat(
//   data: any[][]
// ): Record<string, Record<string, any>> {
//   const cellData: Record<string, Record<string, any>> = {};

//   data.forEach((row, rowIndex) => {
//     row.forEach((cellValue, colIndex) => {
//       if (!cellData[rowIndex]) cellData[rowIndex] = {};
//       if (cellValue !== undefined && cellValue !== null) {
//         cellData[rowIndex][colIndex] = {
//           v: cellValue,
//           t: typeof cellValue === "number" ? 2 : 1, // 1=string, 2=number
//         };
//       }
//     });
//   });

//   return cellData;
// }

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "public", "sample.xlsx");

// GET: Load Excel file
export async function GET() {
  try {
    const file = await fs.readFile(FILE_PATH);
    return new NextResponse(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "File not found or cannot be read" },
      { status: 404 }
    );
  }
}

// PUT: Save Excel file
export async function PUT(req: NextRequest) {
  try {
    const data = await req.arrayBuffer();
    await fs.writeFile(FILE_PATH, Buffer.from(data));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
