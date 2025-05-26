// src/pages/upload.tsx
"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !email) {
      setError("Please select a file and enter an email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setSheetUrl("");
    setError("");

    const formData = new FormData();
    formData.append("excelFile", file);
    formData.append("email", email);

    try {
      const response = await fetch("/api/upload-and-share", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setSheetUrl(data.sheetUrl || "");
      } else {
        setError(data.error || data.message || "An unknown error occurred.");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to submit the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1>Upload Excel and Share as Google Sheet</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            User&apos;s Google Email to Share With:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="file"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Select Excel File (.xlsx, .xls):
          </label>
          <input
            type="file"
            id="file"
            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 15px",
            backgroundColor: isLoading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Processing..." : "Upload and Share"}
        </button>
      </form>

      {message && (
        <p style={{ color: "green", marginTop: "20px" }}>{message}</p>
      )}
      {sheetUrl && (
        <div style={{ marginTop: "10px" }}>
          <p>
            Google Sheet Link:{" "}
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
              {sheetUrl}
            </a>
          </p>
          <p>
            The user with email <strong>{email}</strong> now has edit access.
          </p>
        </div>
      )}
      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>Error: {error}</p>
      )}
    </div>
  );
}
