import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, logout } from "../services/api.jsx";
import PreviewModal from "./PreviewModal.jsx";
import FileUpload from "./FileUpload.jsx";
import { MoreVertical } from "lucide-react";

export default function FileExplorer() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const menuRef = useRef(null); // ✅ ref for dropdown

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

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ... sidebar code ... */}

      <main className="flex-1 p-6 overflow-y-auto">
        {/* ... top bar code ... */}

        {/* File display */}
        {files.length === 0 ? (
          <p className="text-gray-500">No files found</p>
        ) : viewMode === "list" ? (
          <table className="w-full border-collapse shadow-sm">
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="py-2 px-4">{file.name}</td>
                  <td className="py-2 px-4 relative">
                    <div ref={menuRef}>
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === file.id ? null : file.id)
                        }
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === file.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-20">
                          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                            Open
                          </button>
                          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                            Download
                          </button>
                          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                            Rename
                          </button>
                          <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {files.map((file) => (
              <div key={file.id} className="relative bg-white shadow rounded-lg p-4">
                <p>{file.name}</p>
                <div ref={menuRef}>
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === file.id ? null : file.id)
                    }
                  >
                    <MoreVertical size={18} />
                  </button>
                  {activeMenu === file.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-20">
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        Open
                      </button>
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        Download
                      </button>
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        Rename
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
