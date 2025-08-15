import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function getFileText(fileUrl) {
  try {
    const response = await fetch(fileUrl);
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/pdf")) {
      const pdfData = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }
      return fullText.trim();
    } else {
      return (await response.text()).trim();
    }
  } catch (err) {
    console.error("Error reading file:", err);
    return "[Could not read file content]";
  }
}

export async function fetchAIResponse(fileUrl, question) {
  try {
    let fileText = "";

    if (fileUrl) {
      fileText = await getFileText(fileUrl);
      if (fileText.length > 5000) {
        fileText = fileText.slice(0, 5000) + "\n[Content truncated]";
      }
    }

    const formData = new FormData();
    formData.append("user_id", "test123");
    formData.append("question", question);

    if (fileText) {
      const blob = new Blob([fileText], { type: "text/plain" });
      formData.append("file", blob, "uploaded.txt");
    }

    const res = await fetch(
      "https://89506339-2611-4f47-b987-be6c77e38cec-00-epual7n79g7.pike.replit.dev/ask_ai",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      const rawText = await res.text();
      throw new Error(`HTTP ${res.status} - ${rawText}`);
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      const raw = await res.text();
      throw new Error(`Invalid JSON from server: ${raw}`);
    }

    console.log("AI Response Data:", data);

    if (data.error) {
      return `Error from AI: ${data.error}`;
    }

    return (
      data.answer ||
      data.choices?.[0]?.message?.content ||
      "No response from AI."
    );
  } catch (error) {
    console.error("fetchAIResponse error:", error);
    return `Error connecting to AI: ${error.message}`;
  }
}
