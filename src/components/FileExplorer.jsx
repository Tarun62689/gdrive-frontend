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
  const [showNewMenu, setShowNewMenu] = useState(false);
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
      <aside className="hidden md:flex w-64 bg-white shadow-lg flex-col p-5">
        <button
          onClick={() => setShowNewMenu(!showNewMenu)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition mb-6"
        >
          + New
        </button>

        {showNewMenu && (
          <div className="bg-white border rounded-lg shadow-lg mb-6">
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

        <nav className="space-y-4 text-gray-700 font-medium">
          <p className="cursor-pointer hover:text-blue-600">My Drive</p>
          <p className="cursor-pointer hover:text-blue-600">Shared with me</p>
          <p className="cursor-pointer hover:text-blue-600">Recent</p>
          <p className="cursor-pointer hover:text-blue-600">Starred</p>
          <p className="cursor-pointer hover:text-blue-600">Trash</p>
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search in Drive"
            className="w-full sm:w-1/2 border rounded-lg px-4 py-2 shadow-sm"
          />

          <div className="flex items-center gap-3">
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
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedFile(file)}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      {file.type === "pdf" ? "📄" : file.type === "image" ? "🖼️" : "📁"}
                      <span className="truncate">{file.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {file.updated_at
                        ? new Date(file.updated_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // -------- GRID VIEW --------
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white shadow rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-center justify-center w-full h-24 bg-gray-100 rounded-lg">
                  {file.type === "pdf" ? "📄" : file.type === "image" ? "🖼️" : "📁"}
                </div>
                <p className="mt-2 font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
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
