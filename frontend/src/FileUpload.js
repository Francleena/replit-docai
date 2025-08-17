import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min";
import mammoth from "mammoth";
import "./Chatbot.css";

export default function FileUpload({ onFileUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const filePath = `uploads/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        alert(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;

      let content = "";


      

//txt
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        content = await file.text();
      }

//pdf
      else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let textContent = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map((s) => s.str).join(" ") + "\n";
          }
          content = textContent.trim();
        } catch (pdfError) {
          console.error("PDF processing error:", pdfError);
          alert("Failed to process PDF file.");
          setUploading(false);
          return;
        }
      }

//docx
      else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          content = result.value.trim();
        } catch (docxError) {
          console.error("DOCX processing error:", docxError);
          alert("Failed to process DOCX file.");
          setUploading(false);
          return;
        }
      } 
      
      
      
      else {
        alert(
          "Unsupported file type! Please upload .txt, .pdf, or .docx files.",
        );
        setUploading(false);
        return;
      }



      
      onFileUploaded(publicUrl, content);
      console.log("✅ File extracted:", {
        publicUrl,
        contentLength: content.length,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        id="document-upload"
        onChange={handleUpload}
        accept=".txt,.pdf,.docx"
        style={{ display: "none" }}
      />
      <label htmlFor="document-upload" className="upload-button">
        {uploading ? "Processing..." : "Upload Document (.txt, .pdf, .docx)"}
      </label>
      {uploading && <div className="upload-progress">Extracting text...</div>}
    </div>
  );
}
