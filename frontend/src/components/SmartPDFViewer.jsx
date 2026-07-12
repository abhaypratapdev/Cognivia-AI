import { useEffect, useState } from "react";
import { PDFViewer, PdfFocusProvider } from "@llamaindex/pdf-viewer";
import "@llamaindex/pdf-viewer/index.css";

export default function SmartPDFViewer({ fileUrl, fileId, width, height }) {
  const [renderKey, setRenderKey] = useState(0);

  // Force re-render when size changes
  useEffect(() => {
    setRenderKey((k) => k + 1);
  }, [width, height]);

  return (
    <PdfFocusProvider>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <PDFViewer
          key={renderKey}
          file={{ id: fileId, url: fileUrl }}
          containerClassName="pdf-container"
        />
      </div>
    </PdfFocusProvider>
  );
}