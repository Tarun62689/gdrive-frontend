import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, logout } from "../services/api.jsx";
import PreviewModal from "./PreviewModal.jsx";
import FileUpload from "./FileUpload.jsx";

export default function FileExplorer() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list | grid
  const [showNewMenu, setShowNewMenu] = useState(false); // dropdown toggle
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col relative">
        {/* + New button */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full text-left"
          >
            + New
          </button>

          {/* Dropdown Menu */}
          {showNewMenu && (
            <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              <FileUpload
                onUploadSuccess={(newFile) =>
                  setFiles((prev) => [...prev, newFile])
                }
              />
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                📁 Upload Folder (coming soon)
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                📝 New Document
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                📊 New Spreadsheet
              </button>
            </div>
          )}
        </div>

        <nav className="space-y-2 text-gray-700">
          <p className="font-medium text-gray-900">Home</p>
          <p>My Drive</p>
          <p>Shared with me</p>
          <p>Recent</p>
          <p>Starred</p>
          <p>Trash</p>
        </nav>

        <div className="mt-auto">
          <p className="text-sm text-gray-500">3.12 GB of 2 TB used</p>
          <button className="text-blue-600 text-sm hover:underline">
            Get more storage
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search in Drive"
            className="w-1/2 border rounded-lg px-4 py-2"
          />

          <div className="flex items-center gap-3">
            {/* Toggle Button */}
            <button
              onClick={() =>
                setViewMode(viewMode === "list" ? "grid" : "list")
              }
              className="px-3 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-100"
            >
              {viewMode === "list" ? "🔲 Grid View" : "📋 List View"}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* File display */}
        {files.length === 0 ? (
          <p className="text-gray-500">No files found</p>
        ) : viewMode === "list" ? (
          // -------- LIST VIEW --------
          <table className="w-full border-collapse shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Size</th>
                <th className="py-2 px-4">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  <td className="py-2 px-4 flex items-center gap-2">
                    {file.type === "pdf" ? (
                      <span className="text-red-500 font-bold">📄</span>
                    ) : file.type === "image" ? (
                      <span className="text-blue-500">🖼️</span>
                    ) : (
                      <span className="text-gray-500">📁</span>
                    )}
                    <span className="truncate">{file.name}</span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {(file.size / 1024).toFixed(2)} KB
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {file.updated_at
                      ? new Date(file.updated_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // -------- GRID VIEW --------
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-center justify-center w-full h-32 bg-gray-200">
                  {file.type === "pdf" ? (
                    <span className="text-red-500 font-bold text-lg">📄</span>
                  ) : file.type === "image" ? (
                    <span className="text-blue-500 text-lg">🖼️</span>
                  ) : (
                    <span className="text-gray-500 text-lg">📁</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for file preview */}
      {selectedFile && (
        <PreviewModal
          file={{
            ...selectedFile,
            url:
              selectedFile.type === "pdf" && !selectedFile.url
                ? `https://ripiijqxhhbklktjifgl.supabase.co/storage/v1/object/public/${selectedFile.path}`
                : selectedFile.url,
          }}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
