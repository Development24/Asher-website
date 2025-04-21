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
  canSubmit: boolean;
}

export function LeaseAgreementModal({
  isOpen,
  onClose,
  onSubmit,
  agreementDocumentUrl,
  canSubmit
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
      const loadingToast = toast.loading("Creating signed document...");

      // Optimize: Convert signatures to smaller images before processing
      const optimizedSignatures = await Promise.all(
        signatures.map(async (sig) => {
          // Create a smaller canvas for the signature
          const canvas = document.createElement('canvas');
          canvas.width = 600; // Reasonable size for signature
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');

          // Draw the signature image at the smaller size
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = sig.dataUrl;
          });
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to more efficient format
          const optimizedDataUrl = canvas.toDataURL('image/png', 0.7);
          return {
            ...sig,
            dataUrl: optimizedDataUrl
          };
        })
      );

      // Fetch and load PDF only once
      const pdfBytes = await fetch(agreementDocumentUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();

      // Process all signatures in parallel
      await Promise.all(
        optimizedSignatures.map(async (sig) => {
          const signatureBytes = await fetch(sig.dataUrl)
            .then(res => res.arrayBuffer());
          const signatureImage = await pdfDoc.embedPng(signatureBytes);

          const signatureWidth = width * 0.2; // 20% of page width
          const signatureHeight = height * 0.1; // 10% of page height

          const x = (sig.position.x / width) * width;
          const y = height - ((sig.position.y / height) * height);

          page.drawImage(signatureImage, {
            x: x - (signatureWidth / 2),
            y: y - (signatureHeight / 2),
            width: signatureWidth,
            height: signatureHeight,
          });
        })
      );

      const signedPdfBytes = await pdfDoc.save();
      const signedPdfFile = new File([signedPdfBytes], 'signed-agreement.pdf', {
        type: 'application/pdf',
      });

      // Make sure onSubmit is called before any UI updates
      await onSubmit(signedPdfFile);
      
      toast.dismiss(loadingToast);
      toast.success("Document signed successfully!");
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
              disabled={signatures.length === 0 || canSubmit}
            >
              Save & Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
