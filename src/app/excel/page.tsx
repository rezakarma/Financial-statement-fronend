import EditableSpreadsheet from "@/components/SpreadsheetEditor";

export default function Home() {
  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Excel Editor</h1>
      <EditableSpreadsheet />
    </main>
  );
}