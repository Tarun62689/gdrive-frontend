import React from "react";

export default function PreviewModal({ file, onClose }) {
  const fileName = file.name;
  const fileUrl = file.url;

  const renderPreview = () => {
    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
          <p className="text-lg mb-4">No preview available</p>
          <button
            onClick={() => alert("File URL not available")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download {fileName}
          </button>
        </div>
      );
    }

    if (file.type === "image") {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-h-[70vh] w-auto object-contain mx-auto rounded-lg shadow"
        />
      );
    }

    if (file.type === "pdf") {
      return (
        <div className="flex flex-col items-center w-full">
          <iframe
            src={fileUrl}
            title={fileName}
            className="w-full h-[60vh] border rounded-lg shadow mb-4"
          />
          <a
            href={fileUrl}
            download={fileName}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download PDF
          </a>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
        <p className="text-lg mb-4">No preview available</p>
        <a
          href={fileUrl}
          download={fileName}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Download {fileName}
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold transition"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 truncate pr-8 text-gray-800">
          {fileName}
        </h2>

        {/* Preview Content */}
        <div className="flex justify-center items-center w-full flex-1">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}
