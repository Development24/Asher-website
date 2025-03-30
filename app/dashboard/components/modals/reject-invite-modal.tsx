"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface RejectInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showSuccess: boolean;
  propertyId?: string;
  isLoading: boolean;
}

export function RejectInviteModal({
  isOpen,
  onClose,
  onConfirm,
  showSuccess,
  propertyId,
  isLoading
}: RejectInviteModalProps) {
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Invite Rejected</h2>
            <p className="text-gray-500">
              You've successfully rejected the viewing invite. The
              landlord/agent will be notified.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reject invite?</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to reject this viewing invite? We'll notify the
          landlord/agent of your rejection.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            No, cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            loading={isLoading}
          >
            Yes, reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
