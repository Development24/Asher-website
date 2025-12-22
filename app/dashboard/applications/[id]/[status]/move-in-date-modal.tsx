"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { updateMoveInDate } from "@/services/application/application";
import { toast } from "sonner";

interface MoveInDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  applicationId: string;
}

export function MoveInDateModal({
  isOpen,
  onClose,
  onSuccess,
  applicationId,
}: MoveInDateModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error("Please select a move-in date");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format date as ISO string - backend accepts multiple formats
      const moveInDate = selectedDate.toISOString();
      
      await updateMoveInDate(applicationId, { moveInDate });
      
      toast.success("Move-in date updated successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating move-in date:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update move-in date. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Move-In Date</DialogTitle>
          <DialogDescription>
            Please choose your preferred move-in date. This will help us prepare everything for your arrival.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 w-4 h-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !selectedDate}>
            {isSubmitting ? "Saving..." : "Confirm Move-In Date"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
