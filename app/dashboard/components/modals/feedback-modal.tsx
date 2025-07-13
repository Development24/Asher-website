"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCreateFeedback } from "@/services/property/propertyFn";
import { toast } from "sonner";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  data,
  onComplete
}: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState("");
  const [rentAnswer, setRentAnswer] = useState<boolean | null>(null);
  const [viewAnswer, setViewAnswer] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const { mutate: createFeedback, isPending } = useCreateFeedback();

  const handleSubmit = () => {
    setError("");
    if (!feedback.trim()) {
      setError("Please provide your feedback.");
      return;
    }
    if (rentAnswer === null && viewAnswer === null) {
      setError("Please answer at least one of the questions below.");
      return;
    }
    const basePayload = {
      propertyId: data?.propertyId,
      applicationInvitedId: data?.applicantInviteId || null,
      events: feedback,
      type: "FEEDBACK",
      response: "FEEDBACK"
    };
    let payload = basePayload;
    if (rentAnswer !== null) {
      payload = {
        ...payload,
        considerRenting: rentAnswer ? "YES" : "NO"
      };
    }
    if (viewAnswer !== null) {
      payload = {
        ...payload,
        viewAgain: viewAnswer ? "YES" : "NO"
      };
    }
    createFeedback(
      { ...payload } as any,
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
          setError("Something went wrong. Please try again.");
        }
      }
    );
  };

  // Fallbacks for missing data
  const propertyImage = data?.images?.[0] || "/placeholder.jpg";
  const propertyName = data?.name || "Property";
  const propertyAddress = data?.address || "N/A";
  const propertyPrice =
    typeof data?.rentalFee === "number" && !isNaN(data.rentalFee)
      ? formatPrice(data.rentalFee)
      : "—";
  const bedrooms = data?.noBedRoom ?? "—";
  const bathrooms = data?.noBathRoom ?? "—";
  const propertySize = data?.propertysize ? `${data.propertysize} sqft` : null;

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
            <div className="bg-white p-0 sm:p-0 rounded-2xl shadow-2xl w-full max-w-lg">
              {/* Property Info */}
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 border-b border-neutral-100 p-6 pb-4">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-neutral-100 border">
                    <Image
                      src={propertyImage}
                      alt={propertyName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <h2 className="text-xl font-bold text-neutral-900 mb-1 truncate">{propertyName}</h2>
                  <p className="text-sm text-neutral-500 mb-2 truncate">{propertyAddress}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-1">
                    {propertySize && <span>{propertySize}</span>}
                    {propertySize && <span>•</span>}
                    <span>{bedrooms} bedrooms</span>
                    <span>•</span>
                    <span>{bathrooms} bathrooms</span>
                  </div>
                  <div className="text-lg font-semibold text-primary-600">{propertyPrice}</div>
                </div>
              </div>

              {/* Feedback Form */}
              <form
                className="space-y-6 p-6"
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Add your feedback
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="What did you like/dislike about the property?"
                    className={`min-h-[100px] resize-none ${error && !feedback.trim() ? "border-red-500" : ""}`}
                    maxLength={500}
                  />
                  {error && !feedback.trim() && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Would you consider renting this property?
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={rentAnswer === true ? "default" : "outline"}
                        className={`flex-1 h-10 ${rentAnswer === true ? "ring-2 ring-primary-500" : ""}`}
                        onClick={() => setRentAnswer(true)}
                        tabIndex={0}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={rentAnswer === false ? "default" : "outline"}
                        className={`flex-1 h-10 ${rentAnswer === false ? "ring-2 ring-primary-500" : ""}`}
                        onClick={() => setRentAnswer(false)}
                        tabIndex={0}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Would you like to view this property again?
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={viewAnswer === true ? "default" : "outline"}
                        className={`flex-1 h-10 ${viewAnswer === true ? "ring-2 ring-primary-500" : ""}`}
                        onClick={() => setViewAnswer(true)}
                        tabIndex={0}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={viewAnswer === false ? "default" : "outline"}
                        className={`flex-1 h-10 ${viewAnswer === false ? "ring-2 ring-primary-500" : ""}`}
                        onClick={() => setViewAnswer(false)}
                        tabIndex={0}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>
                {error && feedback.trim() && (rentAnswer === null && viewAnswer === null) && (
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={isPending}
                    className="w-28"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !feedback.trim() ||
                      (rentAnswer === null && viewAnswer === null) ||
                      isPending
                    }
                    className="w-40 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center"
                  >
                    {isPending && (
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    )}
                    Submit feedback
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
