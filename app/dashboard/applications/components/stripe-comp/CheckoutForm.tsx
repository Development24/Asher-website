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

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: typeof window !== 'undefined' ? `${window.location.origin}/dashboard/applications/payment-success` : '/dashboard/applications/payment-success'
      }
    });

    if (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      onPaymentError?.(error);
    } else {
      // Payment successful
      onPaymentSuccess?.();
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
