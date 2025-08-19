import React, { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // 👈 same field name as backend

    try {
      // get token from localStorage or cookies
      const token = localStorage.getItem("token");  

      const res = await axios.post(
        "https://gdrive-backend-elin.onrender.com/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // 👈 pass token here
          },
          withCredentials: true, // if backend uses cookies too
        }
      );

      setMessage("File uploaded successfully ✅");
      console.log("Upload response:", res.data);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.error || "File upload failed ❌"
      );
    }
  };

  return (
    <div className="p-4 border rounded w-96 mx-auto">
      <h2 className="text-lg font-semibold mb-2">Upload File</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-3 border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
