import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const EXCEL_FILES_DIR = path.join(process.cwd(), 'data');

// GET Excel file
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const filePath = path.join(EXCEL_FILES_DIR, `${params.id}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

// Save Excel file
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  const filePath = path.join(EXCEL_FILES_DIR, `${params.id}.json`);
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}