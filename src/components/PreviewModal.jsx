// PreviewModal.jsx
import { X } from "lucide-react";
import DocumentViewer from "./DocumentViewer.jsx";

export default function PreviewModal({ file, onClose }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-5xl h-[90%] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{file.name}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Preview */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <DocumentViewer file={file} />
        </div>
      </div>
    </div>
  );
}
