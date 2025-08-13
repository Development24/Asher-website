"use client";
import React from "react";
import dynamic from "next/dynamic";
// @ts-ignore
import "@react-pdf-viewer/core/lib/styles/index.css";
// @ts-ignore
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewerInner = dynamic(async () => {
  const [core, layout] = await Promise.all([
    import("@react-pdf-viewer/core"),
    import("@react-pdf-viewer/default-layout")
  ]);
  return function PDFViewerInnerImpl({ agreementDocumentUrl }: { agreementDocumentUrl?: string | null }) {
    const defaultLayoutPluginInstance = layout.defaultLayoutPlugin();
    return (
      <core.Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        {agreementDocumentUrl ? (
          <core.Viewer
            key={agreementDocumentUrl}
            fileUrl={agreementDocumentUrl}
            plugins={[defaultLayoutPluginInstance]}
          />
        ) : (
          <div className="p-4 text-sm text-gray-600">No PDF available.</div>
        )}
      </core.Worker>
    );
  };
}, { ssr: false });

export default function PDFViewerLazy({ agreementDocumentUrl }: { agreementDocumentUrl?: string | null }) {
  return <PDFViewerInner agreementDocumentUrl={agreementDocumentUrl} />;
} 