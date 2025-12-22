import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  onClose: () => void;
  amount?: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onClose,
  amount,
  currency = "USD",
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Please check your payment details.");
        setIsProcessing(false);
        return;
      }

      // Confirm payment without redirect to handle success in the same page
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: typeof window !== 'undefined' ? `${window.location.origin}/dashboard/applications/payment-success` : '/dashboard/applications/payment-success'
        },
        redirect: "if_required" // Only redirect if required (e.g., 3D Secure)
    });

      if (confirmError) {
        console.error("Payment error:", confirmError);
        setError(confirmError.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        onPaymentError?.(confirmError);
      } else {
        // Check payment intent status
        if (paymentIntent?.status === 'succeeded') {
          // Payment successful - call success callback
          onPaymentSuccess?.();
        } else if (paymentIntent?.status === 'requires_action') {
          // Payment requires additional action (e.g., 3D Secure)
          // Stripe will handle the redirect automatically
          // The return_url will handle the success case
        } else {
          setError("Payment is being processed. Please wait...");
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      console.error("Unexpected payment error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsProcessing(false);
      onPaymentError?.(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {amount && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Application Fee:</span>
            <span className="font-semibold text-lg">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency
              }).format(amount / 100)}
            </span>
          </div>
        </div>
      )}

      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          Payment method
        </label>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                name: "auto",
                email: "auto",
                phone: "auto",
                address: "auto"
              }
            }
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button
          className="bg-primary text-white"
          type="submit"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
