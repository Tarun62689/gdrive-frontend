import { useEffect, useState } from "react";
import { FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { FaRegFilePdf, FaRegFileImage } from "react-icons/fa";

export default function FileExplorer() {
  const [quickAccess, setQuickAccess] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch(
          "https://gdrive-backend-elin.onrender.com/api/user/data",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 401) {
          // ❌ Unauthorized → token invalid
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch files");

        const data = await res.json();

        const mapItem = (item, index) => ({
          id: item.id || `file-${index}`,
          label: item.name || item.path?.split("/").pop() || "Untitled",
          type: item.mime_type?.startsWith("image/")
            ? "image"
            : item.mime_type === "application/pdf"
            ? "pdf"
            : item.type === "folder"
            ? "folder"
            : "document",
          src: item.path
            ? `https://gdrive-backend-elin.onrender.com/${item.path}`
            : null,
        });

        setQuickAccess((data.quickAccess || []).map(mapItem));
        setAllFiles((data.files || []).map(mapItem));
      } catch (err) {
        console.error(err);
        alert("Failed to fetch files. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

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
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b">
          <img src="/logo192.png" alt="Logo" className="h-9" />
          <span className="text-xl font-bold text-gray-700">Drive</span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 gap-5">
          {quickAccess.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-3 flex flex-col items-center"
            >
              {renderItemIcon(item)}
              <p className="text-xs text-gray-700 truncate w-full text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-3">All Files</h2>
        <div className="grid grid-cols-5 gap-5">
          {allFiles.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-3 flex flex-col items-center"
            >
              {renderItemIcon(item)}
              <p className="text-xs text-gray-700 truncate w-full text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
