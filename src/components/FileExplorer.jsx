import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, logout } from "../services/api.jsx";
import PreviewModal from "./PreviewModal";

// Default icons for PDF and generic file
const PDF_ICON = "https://cdn-icons-png.flaticon.com/512/337/337946.png";
const FILE_ICON = "https://cdn-icons-png.flaticon.com/512/109/109612.png";

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

  const renderFileIcon = (file) => {
    if (file.type === "image" && file.thumbnail) {
      return (
        <img
          src={file.thumbnail}
          alt={file.name}
          className="w-full h-32 object-cover rounded-t"
        />
      );
    }

    if (file.type === "pdf") {
      return (
        <img
          src={PDF_ICON}
          alt="PDF Icon"
          className="w-full h-32 object-contain rounded-t bg-red-50 p-4"
        />
      );
    }

    return (
      <img
        src={FILE_ICON}
        alt="File Icon"
        className="w-full h-32 object-contain rounded-t bg-gray-50 p-4"
      />
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
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFile && (
        <PreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </div>
  );
}
