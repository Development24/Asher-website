"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import SignatureCanvas from "react-signature-canvas";
import { X, Trash2, Move } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import {
  buildTypedSignatureHtml,
  getInitialsFromName,
  replaceTenantSignaturePlaceholders
} from "./signature-helpers";

type SignaturePosition = {
  x: number;
  y: number;
};

interface LeaseAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (signedDoc: File) => void;
  onSubmitJson?: (payload: {
    updatedProcessedContent: string;
    userSignature: string;
  }) => void;
  agreementDocumentUrl?: string | null;
  agreementHtml?: string | null;
  canSubmit: boolean;
  tenantFullName?: string | null;
}

export function LeaseAgreementModal({
  isOpen,
  onClose,
  onSubmit,
  onSubmitJson,
  agreementDocumentUrl,
  agreementHtml,
  canSubmit,
  tenantFullName
}: LeaseAgreementModalProps) {
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<
    Array<{ position: SignaturePosition; dataUrl: string }>
  >([]);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [tempPosition, setTempPosition] = useState<SignaturePosition | null>(
    null
  );
  const [activeSignature, setActiveSignature] = useState<number | null>(null);
  const [signatureMode, setSignatureMode] = useState<
    "draw" | "type-name" | "type-initials"
  >("draw");
  const [typedSignatureValue, setTypedSignatureValue] = useState<string>(
    tenantFullName || ""
  );
  const [isEditingTyped, setIsEditingTyped] = useState<boolean>(false);
  const [displayHtml, setDisplayHtml] = useState<string | null>(
    agreementHtml || null
  );

  const PDFViewer = dynamic(() => import("./pdf-viewer-lazy"), {
    ssr: false,
    loading: () => <div>Loading PDF viewer...</div>
  });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeSignature !== null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTempPosition({ x, y });
    setShowSignaturePad(true);
  };

  const handleSaveSignature = () => {
    if (!tempPosition) return;
    let dataUrl: string | null = null;
    if (signatureMode === "draw") {
      if (!signatureRef.current) return;
      dataUrl = signatureRef.current.toDataURL("image/png");
    } else {
      dataUrl = signatureDataUrl;
    }
    if (!dataUrl) return;
    setSignatures((prev) => [...prev, { position: tempPosition, dataUrl }]);
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

    setSignatures((prev) =>
      prev.map((sig, index) =>
        index === activeSignature ? { ...sig, position: { x, y } } : sig
      )
    );
  };

  const handleMouseUp = () => {
    setActiveSignature(null);
  };

  const handleDeleteSignature = (index: number) => {
    setSignatures((prev) => prev.filter((_, i) => i !== index));
  };

  const getInitials = (name?: string | null) => {
    return getInitialsFromName(name);
  };

  const createTypedSignatureDataUrl = async (text: string): Promise<string> => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111827";
    ctx.font = "italic 64px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL("image/png", 0.9);
  };

  // Update live display when in typed modes
  const refreshDisplayHtmlForTyped = (text: string) => {
    if (!agreementHtml) return;
    const signatureHtml = buildTypedSignatureHtml(text);
    const updated = replaceTenantSignaturePlaceholders(
      agreementHtml,
      signatureHtml
    );
    setDisplayHtml(updated);
  };

  const createSignedPDF = async () => {
    try {
      const loadingToast = toast.loading("Creating signed document...");

      // Optimize: Convert signatures to smaller images before processing
      const optimizedSignatures = await Promise.all(
        signatures.map(async (sig) => {
          // Create a smaller canvas for the signature
          const canvas = document.createElement("canvas");
          canvas.width = 600; // Reasonable size for signature
          canvas.height = 300;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not get canvas context");

          // Draw the signature image at the smaller size
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = sig.dataUrl;
          });
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to more efficient format
          const optimizedDataUrl = canvas.toDataURL("image/png", 0.7);
          return {
            ...sig,
            dataUrl: optimizedDataUrl
          };
        })
      );

      if (!agreementHtml && agreementDocumentUrl) {
        const pdfBytes = await fetch(agreementDocumentUrl).then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();

        await Promise.all(
          optimizedSignatures.map(async (sig) => {
            const signatureBytes = await fetch(sig.dataUrl).then((res) =>
              res.arrayBuffer()
            );
            const signatureImage = await pdfDoc.embedPng(signatureBytes);

            const signatureWidth = width * 0.2;
            const signatureHeight = height * 0.1;

            const x = (sig.position.x / width) * width;
            const y = height - (sig.position.y / height) * height;

            page.drawImage(signatureImage, {
              x: x - signatureWidth / 2,
              y: y - signatureHeight / 2,
              width: signatureWidth,
              height: signatureHeight
            });
          })
        );

        const signedPdfBytes = await pdfDoc.save();
        const signedPdfFile = new File(
          [signedPdfBytes],
          "signed-agreement.pdf",
          {
            type: "application/pdf"
          }
        );

        await onSubmit(signedPdfFile);
        toast.dismiss(loadingToast);
        toast.success("Document signed successfully!");
        onClose();
        return;
      }

      if (agreementHtml) {
        let processed = agreementHtml;
        let signatureImageUrl: string | undefined;
        if (signatureMode === "draw") {
          signatureImageUrl = optimizedSignatures[0]?.dataUrl;
        } else if (signatureMode === "type-name" && tenantFullName) {
          signatureImageUrl = await createTypedSignatureDataUrl(tenantFullName);
        } else if (signatureMode === "type-initials" && tenantFullName) {
          signatureImageUrl = await createTypedSignatureDataUrl(
            getInitials(tenantFullName)
          );
        }

        if (!signatureImageUrl) {
          toast.error("Please provide a signature");
          toast.dismiss(loadingToast);
          return;
        }

        if (signatureMode === "draw") {
          const imgTag = `<img src="${signatureImageUrl}" alt="signature" style="max-width:200px;height:auto;" />`;
          processed = replaceTenantSignaturePlaceholders(processed, imgTag);
        } else {
          // For typed modes, replace with inline italic text (not an image)
          const text =
            signatureMode === "type-name"
              ? typedSignatureValue || tenantFullName || ""
              : getInitials(tenantFullName);
          processed = replaceTenantSignaturePlaceholders(
            processed,
            buildTypedSignatureHtml(text)
          );
        }
        const blob = new Blob([processed], { type: "text/html" });
        const htmlFile = new File([blob], "signed-agreement.html", {
          type: "text/html"
        });
        onSubmitJson?.({
          updatedProcessedContent: processed,
          userSignature: signatureImageUrl
        });
        console.log("htmlFile", processed);
        console.log("htmlFile", signatureImageUrl);
        // onSubmit(htmlFile);
        toast.dismiss(loadingToast);
        toast.success("Agreement signed successfully!");
        onClose();
        return;
      }

      toast.dismiss(loadingToast);
      toast.error("No agreement document available to sign.");
    } catch (error) {
      console.error("Error creating signed PDF:", error);
      toast.error("Failed to create signed document. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Lease Agreement</DialogTitle>
          <DialogDescription>
            Click where you want to add your signature. Drag the move handle to
            reposition.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col min-h-full">
          <div className="flex-1 relative">
            {displayHtml ? (
              // eslint-disable-next-line react/no-danger
              <div
                className="prose max-w-none p-4"
                dangerouslySetInnerHTML={{ __html: displayHtml }}
              />
            ) : agreementDocumentUrl ? (
              <PDFViewer agreementDocumentUrl={agreementDocumentUrl} />
            ) : (
              <div className="p-4 text-sm text-gray-600">
                No agreement document available.
              </div>
            )}
            <div
              className="absolute inset-0 z-10"
              onClick={handleOverlayClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: activeSignature !== null ? "grabbing" : "crosshair"
              }}
            />

            {signatures.map((sig, index) => (
              <div
                key={index}
                className={`absolute z-20 group ${
                  activeSignature === index ? "cursor-grabbing" : ""
                }`}
                style={{
                  left: sig.position.x,
                  top: sig.position.y,
                  transform: "translate(-50%, -50%)",
                  width: "200px",
                  height: "100px"
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

                <div className="border rounded-lg bg-white mb-4 min-h-[200px]">
                  {signatureMode === "draw" ? (
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        className: "w-full h-[200px]",
                        style: {
                          border: "1px solid #e2e8f0",
                          borderRadius: "0.375rem"
                        }
                      }}
                      backgroundColor="white"
                    />
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-700">
                          Typed signature preview
                        </div>
                        <button
                          className="text-red-600 text-sm"
                          onClick={() => setIsEditingTyped((v) => !v)}
                        >
                          {isEditingTyped ? "Done" : "Edit"}
                        </button>
                      </div>
                      {isEditingTyped ? (
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={typedSignatureValue}
                          onChange={(e) => {
                            setTypedSignatureValue(e.target.value);
                            refreshDisplayHtmlForTyped(e.target.value);
                          }}
                          placeholder={
                            signatureMode === "type-initials"
                              ? "Enter initials"
                              : "Enter full name"
                          }
                        />
                      ) : (
                        <div
                          className="prose"
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{
                            __html: buildTypedSignatureHtml(
                              signatureMode === "type-initials"
                                ? getInitials(
                                    typedSignatureValue || tenantFullName
                                  )
                                : typedSignatureValue || tenantFullName || ""
                            )
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between gap-4 items-center flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={signatureMode === "draw" ? "default" : "outline"}
                      onClick={() => setSignatureMode("draw")}
                    >
                      Draw
                    </Button>
                    <Button
                      variant={
                        signatureMode === "type-name" ? "default" : "outline"
                      }
                      onClick={async () => {
                        setSignatureMode("type-name");
                        const base =
                          typedSignatureValue || tenantFullName || "";
                        if (base) {
                          const dataUrl = await createTypedSignatureDataUrl(
                            base
                          );
                          setSignatureDataUrl(dataUrl);
                        }
                        refreshDisplayHtmlForTyped(base);
                      }}
                    >
                      Use full name
                    </Button>
                    <Button
                      variant={
                        signatureMode === "type-initials"
                          ? "default"
                          : "outline"
                      }
                      onClick={async () => {
                        setSignatureMode("type-initials");
                        const base = getInitials(
                          typedSignatureValue || tenantFullName
                        );
                        if (base) {
                          const dataUrl = await createTypedSignatureDataUrl(
                            base
                          );
                          setSignatureDataUrl(dataUrl);
                        }
                        refreshDisplayHtmlForTyped(base);
                      }}
                    >
                      Use initials
                    </Button>
                  </div>

                  <div className="flex gap-2 ml-auto">
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
            </div>
          )}

          {/* Add save button at the bottom */}
          <div className="mt-4 flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={createSignedPDF}
              disabled={(() => {
                if (canSubmit === false) return true;
                // If HTML is available and using typed signature, allow submit
                if (agreementHtml && signatureMode !== "draw") return false;
                // Otherwise require at least one placed signature
                return signatures.length === 0;
              })()}
            >
              Save & Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
