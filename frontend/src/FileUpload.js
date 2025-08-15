import React, { useState } from "react";
import { supabase, fetchPublicFile } from "./supabaseClient";
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
        alert("Upload failed! Check console for details.");
        setUploading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      console.log("Uploaded file URL:", publicUrl);

      const content = await fetchPublicFile(publicUrl);

      onFileUploaded(publicUrl, content);

      alert("File uploaded and content fetched successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input type="file" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
