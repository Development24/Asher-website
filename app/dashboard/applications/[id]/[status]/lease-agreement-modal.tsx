"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import SignatureCanvas from 'react-signature-canvas';
import { X, Trash2, Move } from "lucide-react";
import { PDFDocument } from 'pdf-lib';
import { toast } from "sonner";

type SignaturePosition = {
  x: number;
  y: number;
};

interface LeaseAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (signedPdf: File) => void;
  agreementDocumentUrl: string;
}

export function LeaseAgreementModal({
  isOpen,
  onClose,
  onSubmit,
  agreementDocumentUrl
}: LeaseAgreementModalProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Array<{ position: SignaturePosition; dataUrl: string }>>([]);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [tempPosition, setTempPosition] = useState<SignaturePosition | null>(null);
  const [activeSignature, setActiveSignature] = useState<number | null>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeSignature !== null) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTempPosition({ x, y });
    setShowSignaturePad(true);
  };

  const handleSaveSignature = () => {
    if (!signatureRef.current || !tempPosition) return;
    
    const dataUrl = signatureRef.current.toDataURL('image/png');
    setSignatures(prev => [...prev, { position: tempPosition, dataUrl }]);
    setSignatureDataUrl(dataUrl);
    setShowSignaturePad(false);
  };

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveSignature(index);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeSignature === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSignatures(prev => prev.map((sig, index) => 
      index === activeSignature 
        ? { ...sig, position: { x, y } }
        : sig
    ));
  };

  const handleMouseUp = () => {
    setActiveSignature(null);
  };

  const handleDeleteSignature = (index: number) => {
    setSignatures(prev => prev.filter((_, i) => i !== index));
  };

  const createSignedPDF = async () => {
    try {
      // Show loading toast
      toast.loading("Creating signed document...");

      // Fetch the original PDF
      const pdfBytes = await fetch(agreementDocumentUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // For each signature
      for (const sig of signatures) {
        // Get the page (assuming all signatures are on first page for now)
        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();

        // Convert signature data URL to bytes
        const signatureBytes = await fetch(sig.dataUrl)
          .then(res => res.arrayBuffer());
        
        // Embed the signature image
        const signatureImage = await pdfDoc.embedPng(signatureBytes);
        
        // Calculate position (convert from pixels to PDF coordinates)
        const signatureWidth = 200; // adjust as needed
        const signatureHeight = 100; // adjust as needed
        
        const x = (sig.position.x / width) * width;
        const y = height - ((sig.position.y / height) * height);

        // Draw the signature
        page.drawImage(signatureImage, {
          x: x - (signatureWidth / 2),
          y: y - (signatureHeight / 2),
          width: signatureWidth,
          height: signatureHeight,
        });
      }

      // Save the modified PDF
      const signedPdfBytes = await pdfDoc.save();

      // Create a File object
      const signedPdfFile = new File([signedPdfBytes], 'signed-agreement.pdf', {
        type: 'application/pdf',
      });

      // Call onSubmit with the signed PDF
      await onSubmit(signedPdfFile);

      // Show success toast
      toast.success("Document signed successfully!");
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error creating signed PDF:', error);
      toast.error("Failed to create signed document. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Lease Agreement</DialogTitle>
          <DialogDescription>
            Click where you want to add your signature. Drag the move handle to reposition.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col min-h-full">
          <div className="flex-1 relative">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={agreementDocumentUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>

            <div 
              className="absolute inset-0 z-10"
              onClick={handleOverlayClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: activeSignature !== null ? 'grabbing' : 'crosshair' }}
            />

            {signatures.map((sig, index) => (
              <div
                key={index}
                className={`absolute z-20 group ${activeSignature === index ? 'cursor-grabbing' : ''}`}
                style={{
                  left: sig.position.x,
                  top: sig.position.y,
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '100px',
                }}
              >
                <img
                  src={sig.dataUrl}
                  alt={`Signature ${index + 1}`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDeleteSignature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 ml-1 cursor-grab"
                    onMouseDown={(e) => handleMouseDown(e, index)}
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Signature Modal */}
          {showSignaturePad && (
            <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[600px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Draw your signature</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSignaturePad(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-lg bg-white mb-4">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'w-full h-[200px]',
                      style: {
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem'
                      }
                    }}
                    backgroundColor="white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => signatureRef.current?.clear()}
                  >
                    Clear
                  </Button>
                  <Button onClick={handleSaveSignature}>
                    Save Signature
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Add save button at the bottom */}
          <div className="mt-4 flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={createSignedPDF}
              disabled={signatures.length === 0}
            >
              Save & Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
