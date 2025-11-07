// script.js — handles file upload and displays OCR results

document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const resultDiv = document.getElementById("result");

    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        resultDiv.innerHTML = "⏳ Uploading and extracting text... Please wait.";

        try {
            const response = await fetch("http://127.0.0.1:8000/upload/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            resultDiv.innerHTML = `
                <h3>🧠 Extracted Text:</h3>
                <pre>${data.extracted_text || "No text found"}</pre>
                <h3>📋 Structured Data:</h3>
                <pre>${JSON.stringify(data.structured_data, null, 2)}</pre>
            `;
        } catch (error) {
            console.error("Upload failed:", error);
            resultDiv.innerHTML = `❌ Error: ${error.message}`;
        }
    });
});
