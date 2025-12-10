"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  const [feedbackType, setFeedbackType] = useState<"feedback" | "invite" | null>(null);
  const [rentAnswer, setRentAnswer] = useState<boolean | null>(null);
  const [viewAnswer, setViewAnswer] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const { mutate: createFeedback, isPending } = useCreateFeedback();

  const handleFeedbackTypeChange = (value: string) => {
    setFeedbackType(value as "feedback" | "invite");
    // Clear answers when switching types
    setRentAnswer(null);
    setViewAnswer(null);
  };

  const handleSubmit = () => {
    setError("");
    if (!feedback.trim()) {
      setError("Please provide your feedback.");
      return;
    }
    if (!feedbackType) {
      setError("Please select a feedback type.");
      return;
    }
    if (feedbackType === "feedback" && rentAnswer === null) {
      setError("Please answer the question.");
      return;
    }
    if (feedbackType === "invite" && viewAnswer === null) {
      setError("Please answer the question.");
      return;
    }
    const basePayload = {
      propertyId: data?.propertyId,
      applicationInvitedId: data?.applicantInviteId || null,
      events: feedback,
      type: "FEEDBACK",
      response: "FEEDBACK"
    };
    
    // Only include the relevant field based on feedbackType
    const payload = {
      ...basePayload,
      ...(feedbackType === "feedback" && rentAnswer !== null && {
        considerRenting: rentAnswer ? "YES" : "NO"
      }),
      ...(feedbackType === "invite" && viewAnswer !== null && {
        viewAgain: viewAnswer ? "YES" : "NO"
      })
    };
    createFeedback(
      { ...payload } as any,
      {
        onSuccess: () => {
          setFeedback("");
          setFeedbackType(null);
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
      ? formatPrice(data.rentalFee, data?.currency || 'USD')
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
            className="fixed inset-0 z-50 backdrop-blur-sm bg-background/80"
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="flex fixed inset-0 z-50 justify-center items-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Property feedback dialog"
          >
            <div className="p-0 w-full max-w-lg bg-white rounded-2xl shadow-2xl sm:p-0">
              {/* Property Info */}
              <div className="flex flex-col gap-0 p-6 pb-4 border-b sm:flex-row sm:gap-6 border-neutral-100">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <div className="overflow-hidden relative w-32 h-24 rounded-lg border bg-neutral-100">
                    <Image
                      src={propertyImage}
                      alt={propertyName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <h2 className="mb-1 text-xl font-bold truncate text-neutral-900">{propertyName}</h2>
                  <p className="mb-2 text-sm truncate text-neutral-500">{propertyAddress}</p>
                  <div className="flex flex-wrap gap-2 items-center mb-1 text-xs text-neutral-500">
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
                className="p-6 space-y-6"
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-900">
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
                    <p className="mt-1 text-xs text-red-600">{error}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-medium text-neutral-900">
                    What would you like to do?
                  </label>
                  <RadioGroup
                    value={feedbackType || ""}
                    onValueChange={handleFeedbackTypeChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feedback" id="feedback" />
                      <Label htmlFor="feedback" className="text-sm font-normal cursor-pointer">
                        Provide Feedback
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="invite" id="invite" />
                      <Label htmlFor="invite" className="text-sm font-normal cursor-pointer">
                        Invite to Apply
                      </Label>
                    </div>
                  </RadioGroup>
                  {error && !feedbackType && (
                    <p className="mt-2 text-xs text-red-600">{error}</p>
                  )}
                </div>

                {feedbackType === "feedback" && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900">
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
                    {error && feedbackType === "feedback" && rentAnswer === null && (
                      <p className="mt-2 text-xs text-red-600">{error}</p>
                    )}
                  </div>
                )}

                {feedbackType === "invite" && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900">
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
                    {error && feedbackType === "invite" && viewAnswer === null && (
                      <p className="mt-2 text-xs text-red-600">{error}</p>
                    )}
                  </div>
                )}
                <div className="flex gap-3 justify-end pt-4">
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
                      !feedbackType ||
                      (feedbackType === "feedback" && rentAnswer === null) ||
                      (feedbackType === "invite" && viewAnswer === null) ||
                      isPending
                    }
                    className="flex justify-center items-center w-40 text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {isPending && (
                      <svg className="mr-2 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
