// src/components/FileExplorer.jsx
import { useEffect, useState } from "react";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { FaRegFilePdf, FaRegFileImage } from "react-icons/fa";

export default function FileExplorer() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickAccess, setQuickAccess] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getUserInitials = () => "U"; 

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/data`, {
          credentials: "include",
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();

        const mapItem = (item) => ({
          id: item.id,
          label: item.name || item.path.split("/").pop() || "Untitled",
          type: item.mime_type?.startsWith("image/")
            ? "image"
            : item.mime_type === "application/pdf"
            ? "pdf"
            : item.type === "folder"
            ? "folder"
            : "document",
          src: item.path ? `${BACKEND_URL}/${item.path}` : null,
        });

        setQuickAccess((data.quickAccess || []).map(mapItem));
        setAllFiles((data.files || []).map(mapItem));
      } catch (error) {
        console.error(error);
        alert("Failed to fetch files. Please login again.");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleLogout = async () => {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  };

  const renderItemIcon = (item) => {
    if (item.type === "folder")
      return <FolderIcon className="h-10 w-10 text-blue-500 mb-1" />;
    if (item.type === "pdf")
      return <FaRegFilePdf className="h-10 w-10 text-red-500 mb-1" />;
    if (item.type === "image")
      return item.src ? (
        <img
          src={item.src}
          alt={item.label}
          className="object-cover rounded mb-1 h-16 w-full"
        />
      ) : (
        <FaRegFileImage className="h-10 w-10 text-pink-500 mb-1" />
      );
    if (item.type === "document")
      return <DocumentIcon className="h-10 w-10 text-purple-500 mb-1" />;
    return null;
  };

  if (loading) return <p className="p-4">Loading your files...</p>;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b">
          <img src="/logo192.png" alt="Logo" className="h-9" />
          <span className="text-xl font-bold text-gray-700">Drive</span>
        </div>
        <div className="flex-1 p-3">
          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">
              <FolderIcon className="h-5 w-5" /> My Drive
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              Computers
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              Shared with me
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              Recents
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              Starred
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              Bin
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center px-8 py-4 bg-white shadow-sm justify-between relative">
          <input
            type="text"
            placeholder="Search Drive..."
            className="w-1/2 border rounded-full px-4 py-1 shadow-sm focus:ring focus:ring-blue-200"
          />
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold"
            >
              {getUserInitials()}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border">
                <button
                  onClick={() => alert("Profile page not implemented yet")}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Quick Access */}
        <section className="px-8 py-6">
          <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
          <div className="grid grid-cols-4 gap-5">
            {quickAccess.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-3 flex flex-col items-center hover:shadow-lg transition cursor-pointer w-full"
              >
                {renderItemIcon(item)}
                <p className="text-xs text-gray-700 truncate w-full text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* All Files */}
        <section className="px-8 py-6">
          <h2 className="text-lg font-semibold mb-3">All Files</h2>
          <div className="grid grid-cols-5 gap-5">
            {allFiles.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-3 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
              >
                {renderItemIcon(item)}
                <p className="text-xs text-gray-700 truncate w-full text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
