import React from "react";

export default function PreviewModal({ file, onClose }) {
  const fileName = file.name || file.path.split("/").pop();
  const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/${file.path}`;

  const renderPreview = () => {
    if (file.mime_type.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-h-[80vh] max-w-full object-contain mx-auto"
        />
      );
    }
    if (file.mime_type === "application/pdf") {
      return (
        <iframe
          src={fileUrl}
          title={fileName}
          className="w-full h-[80vh] border rounded"
        />
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
        <p className="text-lg mb-4">No preview available</p>
        <a
          href={fileUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download {fileName}
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 font-bold text-xl"
        >
          ✕
        </button>

        {/* File Title */}
        <h2 className="text-lg font-semibold mb-4 truncate">{fileName}</h2>

        {/* Preview */}
        <div className="flex justify-center items-center">{renderPreview()}</div>
      </div>
    </div>
  );
}
