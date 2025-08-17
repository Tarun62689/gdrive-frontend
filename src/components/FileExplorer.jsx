import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, logout } from "../services/api.jsx";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

export default function FileExplorer() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
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

  const getFileName = (file) => file.name || file.path.split("/").pop();

  const renderFileIcon = (file) => {
    if (file.mime_type.startsWith("image/")) {
      return (
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/${file.path}`}
          alt={getFileName(file)}
          className="w-full h-32 object-cover rounded-t"
        />
      );
    }
    if (file.mime_type === "application/pdf") {
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
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {renderFileIcon(file)}

              <div className="p-3">
                <p className="font-medium truncate">{getFileName(file)}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                {file.mime_type === "application/pdf" && (
                  <button
                    onClick={() =>
                      setSelectedPdf(
                        `${process.env.REACT_APP_BACKEND_URL}/${file.path}`
                      )
                    }
                    className="text-blue-600 text-sm underline mt-1 block"
                  >
                    View PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF PREVIEW SECTION */}
      {selectedPdf && (
        <div className="mt-8 bg-white shadow p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">PDF Preview</h2>
            <button
              onClick={() => setSelectedPdf(null)}
              className="text-red-500 hover:underline"
            >
              Close
            </button>
          </div>

          <Document
            file={selectedPdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
}
