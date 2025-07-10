"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateFeedback } from "@/services/property/propertyFn";
import { Property } from "@/services/property/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
  data?: {
    propertyId: string;
    applicantInviteId: string;
    images: string[];
    name: string;
    address: string;
    rentalFee: number;
    propertysize: number;
    noBedRoom: number;
    noBathRoom: number;
  };
  onComplete?: () => void;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  property,
  data,
  onComplete
}: FeedbackModalProps) => {
  console.log(data);
  const [feedback, setFeedback] = useState("");
  const [rentAnswer, setRentAnswer] = useState<boolean | null>(null);
  const [viewAnswer, setViewAnswer] = useState<boolean | null>(null);

  const { mutate: createFeedback, isPending  } = useCreateFeedback();

  const handleSubmit = () => {
    const basePayload = {
      propertyId: data?.propertyId,
      applicationInvitedId: data?.applicantInviteId || null,
      events: feedback,
      type: "FEEDBACK",
      response: "FEEDBACK"
    };
    let payload = null;
    if (rentAnswer !== null) {
      payload = {
        ...basePayload,
        considerRenting: rentAnswer ? "YES" : "NO"
      };
    }
    if (viewAnswer !== null) {
      payload = {
        ...basePayload,
        viewAgain: viewAnswer ? "YES" : "NO"
      };
    }
    if (feedback && (rentAnswer !== null || viewAnswer !== null)) {
      createFeedback(
        { ...basePayload, ...payload },
        {
          onSuccess: () => {
            setFeedback("");
            setRentAnswer(null);
            setViewAnswer(null);
            onClose();
            onComplete?.();
          },
          onError: (error: any) => {
            toast.error("Error submitting feedback:", error);
            console.error("Error submitting feedback:", error);
          }
        }
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Property feedback dialog"
          >
            <div className="bg-background/50 backdrop-blur-md p-6 sm:p-2 rounded-lg shadow-lg w-full max-w-2xl">
              <div className="max-h-[90vh] overflow-y-auto">
                <div className="flex gap-6 mb-8 sm:flex-col sm:gap-2">
                  <div className="relative w-48 h-32 sm:w-24 sm:h-20 rounded-lg overflow-hidden mx-auto">
                    <Image
                      src={data?.images[0] || "/placeholder.jpg"}
                      alt={data?.name || "property image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{data?.name}</h2>
                    <p className="text-muted-foreground">{data?.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{data?.propertysize}</span>
                      <span>•</span>
                      <span>{data?.noBedRoom} bedrooms</span>
                      <span>•</span>
                      <span>{data?.noBathRoom} bathrooms</span>
                    </div>
                    <div className="mt-2 text-xl font-semibold">
                      {formatPrice(data?.rentalFee as number)}
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg mb-4">Add your feedback</h3>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="What did you like/dislike about the property?"
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="space-y-4">
                      <h3 className="text-lg">
                        Would you consider renting this property?
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-2">
                        <Button
                          variant={rentAnswer === true ? "default" : "outline"}
                          onClick={() => {
                            setRentAnswer(true);
                            if (viewAnswer !== null) setViewAnswer(null);
                          }}
                          className="h-12"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={rentAnswer === false ? "default" : "outline"}
                          onClick={() => {
                            setRentAnswer(false);
                            if (viewAnswer !== null) setViewAnswer(null);
                          }}
                          className="h-12"
                        >
                          No
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg">
                        Would you like to view this property again?
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-2">
                        <Button
                          variant={viewAnswer === true ? "default" : "outline"}
                          onClick={() => {
                            setViewAnswer(true);
                            if (rentAnswer !== null) setRentAnswer(null);
                          }}
                          className="h-12"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={viewAnswer === false ? "default" : "outline"}
                          onClick={() => {
                            setViewAnswer(false);
                            if (rentAnswer !== null) setRentAnswer(null);
                          }}
                          className="h-12"
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={isPending}
                    className="w-32"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !feedback ||
                      (rentAnswer === null && viewAnswer === null) ||
                      isPending
                    }
                    loading={isPending}
                    className="w-40 bg-red-600 hover:bg-red-700"
                  >
                    Submit feedback
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default FeedbackModal;
