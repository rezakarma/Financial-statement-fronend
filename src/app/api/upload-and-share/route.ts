import { NextResponse } from 'next/server';
import { google, Auth } from 'googleapis';
import { Readable } from 'stream'; // For creating a Node.js Readable stream
import fs from 'fs'; // For checking service account key file
import path from 'path'; // For resolving service account key file path

// --- Configuration ---
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || undefined; // Optional: parent folder
const SCOPES = ['https://www.googleapis.com/auth/drive']; // Full drive access

interface ApiResponse {
  message: string;
  sheetUrl?: string;
  fileId?: string; // ID of the Google Sheet
  error?: string;
  originalExcelId?: string;
}

// --- Google API Authentication (remains the same as before) ---
let driveClient: ReturnType<typeof google.drive> | null = null;

function getDriveClient(): ReturnType<typeof google.drive> {
  if (!SERVICE_ACCOUNT_KEY_PATH) {
    throw new Error("Service account key path not configured in environment variables.");
  }
  // Resolve path relative to current working directory (project root)
  const resolvedKeyPath = path.resolve(process.cwd(), SERVICE_ACCOUNT_KEY_PATH);
  if (!fs.existsSync(resolvedKeyPath)) {
    throw new Error(`Service account key file not found at: ${resolvedKeyPath}. Current cwd: ${process.cwd()}`);
  }

  if (!driveClient) {
    const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
      keyFile: resolvedKeyPath,
      scopes: SCOPES,
    });
    driveClient = google.drive({ version: 'v3', auth });
  }
  return driveClient;
}

// --- API Handler for POST requests ---
export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const drive = getDriveClient();
    const formData = await request.formData();

    const userEmail = formData.get('email') as string | null;
    const uploadedFile = formData.get('excelFile') as File | null; // This is a Web API File object

    if (!uploadedFile) {
      return NextResponse.json(
        { message: "No Excel file uploaded.", error: "No file provided." },
        { status: 400 }
      );
    }
    if (!userEmail) {
      return NextResponse.json(
        { message: "Email for sharing not provided.", error: "No email provided." },
        { status: 400 }
      );
    }

    // Convert Web API File to Node.js Buffer, then to Readable stream for googleapis
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const readableFileStream = new Readable();
    readableFileStream.push(buffer);
    readableFileStream.push(null); // Signal end of stream

    const originalFileName = uploadedFile.name || 'uploaded_excel_file.xlsx';
    const fileExtension = path.extname(originalFileName);
    const baseFileName = path.basename(originalFileName, fileExtension);

    // 1. Upload original Excel file to Google Drive
    const excelFileMetadata = {
      name: originalFileName,
      parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : undefined,
    };
    const excelMedia = {
      mimeType: uploadedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      body: readableFileStream, // Use the Node.js Readable stream
    };

    const uploadedExcelFile = await drive.files.create({
      requestBody: excelFileMetadata,
      media: excelMedia,
      fields: 'id, name',
    });

    if (!uploadedExcelFile.data.id) {
        throw new Error("Failed to upload original Excel file to Google Drive.");
    }
    const originalExcelId = uploadedExcelFile.data.id;
    console.log(`Uploaded original Excel: ${uploadedExcelFile.data.name} (ID: ${originalExcelId})`);

    // 2. Convert uploaded Excel file to Google Sheet
    const googleSheetMetadata = {
      name: `${baseFileName} (Sheet)`, // Name for the new Google Sheet
      parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : undefined,
      mimeType: 'application/vnd.google-apps.spreadsheet',
    };

    const convertedSheet = await drive.files.copy({
      fileId: originalExcelId,
      requestBody: googleSheetMetadata,
      fields: 'id, name, webViewLink', // webViewLink is the direct link
    });

    if (!convertedSheet.data.id || !convertedSheet.data.webViewLink) {
      throw new Error("Failed to convert Excel to Google Sheet.");
    }
    const sheetId = convertedSheet.data.id;
    const sheetUrl = convertedSheet.data.webViewLink;
    console.log(`Converted to Google Sheet: ${convertedSheet.data.name} (ID: ${sheetId}), URL: ${sheetUrl}`);

    // 3. Share the Google Sheet with the user
    const permission = {
      type: 'user',
      role: 'writer', // 'reader' for view-only
      emailAddress: userEmail,
    };

    await drive.permissions.create({
      fileId: sheetId,
      requestBody: permission,
      // sendNotificationEmail: false, // Optional
    });
    console.log(`Shared Google Sheet ${sheetId} with ${userEmail} as writer.`);

    return NextResponse.json({
      message: 'File uploaded, converted, and shared successfully!',
      sheetUrl: sheetUrl,
      fileId: sheetId,
      originalExcelId: originalExcelId,
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    // Check for specific Google API errors if needed
    let errorMessage = 'An unknown server error occurred.';
    if (error.message) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    // If the error object has more details (e.g. from Google API)
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        errorMessage = error.errors.map((e: any) => e.message).join(', ');
    }

    return NextResponse.json(
      {
        message: 'An error occurred during the process.',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}