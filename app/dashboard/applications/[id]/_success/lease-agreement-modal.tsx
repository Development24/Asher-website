"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";

interface LeaseAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function LeaseAgreementModal({
  isOpen,
  onClose,
  onSubmit
}: LeaseAgreementModalProps) {
  const [signature, setSignature] = useState<string | null>(null);

  const signatureRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    signatureRef.current?.clear();
    setSignature(null);
  };

  const handleSubmit = () => {
    if (signatureRef.current?.isEmpty()) {
      alert("Please provide a signature before submitting.");
      return;
    }
    setSignature(signatureRef.current?.toDataURL() || null);
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Lease Agreement</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="max-h-[400px] overflow-y-auto border p-4 rounded-md">
            {/* Add your lease agreement content here */}
            <h2 className="text-lg font-semibold mb-2">Lease Agreement</h2>
            <p>
              This is a sample lease agreement. In a real application, you would
              include the full text of the lease agreement here.
            </p>
            {/* ... more lease agreement content ... */}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Signature</h3>
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: "border rounded-md w-full h-40"
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClear}>
              Clear Signature
            </Button>
            <Button onClick={handleSubmit}>Submit Agreement</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
