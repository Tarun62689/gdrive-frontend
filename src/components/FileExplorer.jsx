import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, logout } from "../services/api.jsx";
import PreviewModal from "./PreviewModal";

export default function FileExplorer() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getUserData();
        setFiles(data.files || []);
      } catch (err) {
        setError("Session expired. Please log in again.");
        navigate("/login");
      }
    };
    fetchFiles();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getFileName = (file) => file.name || file.path?.split("/").pop() || "Unnamed";

  const renderFileIcon = (file) => {
    const mime = file.mime_type || ""; // ✅ Safely handle undefined/null

    if (mime.startsWith("image/")) {
      return (
        <img
          src={file.url} // ✅ Use Supabase public URL
          alt={getFileName(file)}
          className="w-full h-32 object-cover rounded-t"
        />
      );
    }
    if (mime === "application/pdf") {
      return (
        <div className="flex items-center justify-center w-full h-32 bg-red-100 rounded-t text-red-600 font-bold text-xl">
          PDF
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded-t text-gray-600 font-bold text-xl">
        FILE
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Drive</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {files.length === 0 ? (
        <p className="text-gray-500">No files found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedFile(file)}
            >
              {renderFileIcon(file)}

              <div className="p-3">
                <p className="font-medium truncate">{getFileName(file)}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFile && (
        <PreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
