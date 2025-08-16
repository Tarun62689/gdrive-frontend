import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, logout } from "../services/api.jsx";

export default function FileExplorer() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getUserData();
        setFiles(data.files || []);
      } catch (err) {
        console.error(err);
        setError("Session expired or failed to fetch files. Please log in again.");
        navigate("/login");
      }
    };
    fetchFiles();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/login");
    }
  };

  const getFileName = (file) => {
    // fallback to last part of path if name is null
    return file.name || file.path.split("/").pop();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">My Drive</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="bg-white shadow rounded-lg p-4">
        {files.length === 0 ? (
          <p className="text-gray-500">No files found</p>
        ) : (
          files.map((file) => (
            <li key={file.id} className="border-b py-2">
              <strong>{getFileName(file)}</strong> <br />
              <span className="text-sm text-gray-500">
                Type: {file.mime_type} | Size: {(file.size / 1024).toFixed(2)} KB
              </span>
              {file.mime_type.startsWith("image/") && (
                <div className="mt-2">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${file.path}`}
                    alt={getFileName(file)}
                    className="w-48 rounded"
                  />
                </div>
              )}
              {file.mime_type === "application/pdf" && (
                <div className="mt-2">
                  <a
                    href={`${process.env.REACT_APP_BACKEND_URL}/${file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
