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
  return function PDFViewerInnerImpl({ agreementDocumentUrl }: { agreementDocumentUrl: string }) {
    const defaultLayoutPluginInstance = layout.defaultLayoutPlugin();
    return (
      <core.Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <core.Viewer
          fileUrl={agreementDocumentUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </core.Worker>
    );
  };
}, { ssr: false });

export default function PDFViewerLazy({ agreementDocumentUrl }: { agreementDocumentUrl: string }) {
  return <PDFViewerInner agreementDocumentUrl={agreementDocumentUrl} />;
} 