import React from "react";

export default function PreviewModal({ file, onClose }) {
  const fileName = file.name;
  const fileUrl = file.url;

  const renderPreview = () => {
    if (!fileUrl) {
      // No URL available
      return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
          <p className="text-lg mb-4">No preview available</p>
          <button
            onClick={() => alert("File URL not available")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download {fileName}
          </button>
        </div>
      );
    }

    if (file.type === "image") {
      // Image preview
      return <img src={fileUrl} alt={fileName} className="max-h-[80vh] max-w-full object-contain mx-auto" />;
    }

    if (file.type === "pdf") {
      // PDF preview with iframe + download button
      return (
        <div className="flex flex-col items-center w-full">
          <iframe
            src={fileUrl}
            title={fileName}
            className="w-full h-[70vh] border rounded mb-4"
          />
          <a
            href={fileUrl}
            download={fileName}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </a>
        </div>
      );
    }

    // Other file types: no preview, just download
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
        <p className="text-lg mb-4">No preview available</p>
        <a
          href={fileUrl}
          download={fileName}
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
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 font-bold text-xl"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4 truncate">{fileName}</h2>
        <div className="flex justify-center items-center w-full">{renderPreview()}</div>
      </div>
    </div>
  );
}
