import { Document, Page } from "react-pdf";
import { useState } from "react";

export default function DocumentViewer({ file }) {
  const [numPages, setNumPages] = useState(null);

  const url = `${process.env.REACT_APP_BACKEND_URL}/${file.path}`;

  if (file.mime_type.startsWith("image/")) {
    return (
      <img
        src={url}
        alt={file.name}
        className="max-h-full mx-auto object-contain"
      />
    );
  }

  if (file.mime_type === "application/pdf") {
    return (
      <div className="flex justify-center">
        <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
            />
          ))}
        </Document>
      </div>
    );
  }

  return (
    <p className="text-gray-500">
      Preview not available for this file type.{" "}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Download instead
      </a>
    </p>
  );
}
