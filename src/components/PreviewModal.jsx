import React from "react";

export default function PreviewModal({ file, onClose }) {
  const getFileName = (file) => file.name || file.path.split("/").pop();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">{getFileName(file)}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold"
          >
            X
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-auto flex justify-center items-center">
          {file.mime_type.startsWith("image/") && (
            <img src={file.url} alt={getFileName(file)} className="max-h-[60vh] object-contain" />
          )}

          {file.mime_type === "application/pdf" && (
            <iframe
              src={file.url}
              title={getFileName(file)}
              className="w-full h-[60vh]"
            />
          )}

          {!file.mime_type.startsWith("image/") && file.mime_type !== "application/pdf" && (
            <div className="text-center">
              <p className="mb-4">Preview not available</p>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
