// ✅ script.js — Handles file upload, OCR extraction, and display

document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const resultDiv = document.getElementById("result");

    // ✅ Use live backend base URL (Render)
    const BASE_URL = "https://kyc-ai-backend.onrender.com";
    const UPLOAD_ENDPOINT = `${BASE_URL}/upload/`;

    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        resultDiv.innerHTML = `<p style="color:#0078D4;">⏳ Uploading and analyzing your document... Please wait.</p>`;

        try {
            const response = await fetch(UPLOAD_ENDPOINT, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server responded with ${response.status}: ${text}`);
            }

            const data = await response.json();

            if (data.error) {
                resultDiv.innerHTML = `<p style="color:red;">❌ ${data.error}</p>`;
                return;
            }

            // 🧠 Display results neatly
            resultDiv.innerHTML = `
                <h3>📄 Document Type:</h3>
                <p><strong>${data.document_type || "Unknown"}</strong></p>
                
                <h3>🧠 Extracted Text:</h3>
                <pre style="background:#f4f6f8;padding:10px;border-radius:8px;">${data.extracted_text 
                    ? data.extracted_text.slice(0, 1500) + (data.extracted_text.length > 1500 ? "..." : "")
                    : "No text found."
                }</pre>
                
                <h3>📋 Structured Data:</h3>
                <pre style="background:#f4f6f8;padding:10px;border-radius:8px;">${JSON.stringify(data.structured_data ?? {}, null, 2)}</pre>

                ${data.summary ? `
                    <h3>📊 Summary Insights:</h3>
                    <ul>
                        <li><strong>Fields Extracted:</strong> ${data.summary["Fields Extracted"] ?? "N/A"}</li>
                        <li><strong>Confidence:</strong> ${data.summary["Confidence"] ?? "N/A"}</li>
                        <li><strong>Completeness:</strong> ${data.summary["Completeness (%)"] ?? "N/A"}%</li>
                    </ul>
                ` : ""}

                ${data.risk_assessment ? `
                    <h3>⚖️ Risk Assessment:</h3>
                    <ul>
                        <li><strong>Risk Level:</strong> ${data.risk_assessment["Risk Level"] ?? "Unknown"}</li>
                        <li><strong>Reason:</strong> ${data.risk_assessment["Reason"] ?? "N/A"}</li>
                    </ul>
                ` : ""}
            `;
        } catch (error) {
            console.error("❌ Upload failed:", error);
            resultDiv.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
        }
    });
});
