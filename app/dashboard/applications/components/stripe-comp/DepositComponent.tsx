import { Elements } from "@stripe/react-stripe-js";
import { Appearance, type Stripe } from "@stripe/stripe-js";
import React from "react";
import CheckoutForm from "./CheckoutForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DepositComponentProps {
  stripePromise: Promise<Stripe | null>;
  opened: boolean;
  onClose: () => void;
  clientSecret: string | null;
  amount?: number;
  currency?: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: any) => void;
}

const DepositComponent = ({
  stripePromise,
  opened,
  onClose,
  clientSecret,
  amount,
  currency = "USD",
  onPaymentSuccess,
  onPaymentError
}: DepositComponentProps) => {
  if (!clientSecret) return null;

  const appearance = {
    theme: "flat"
  };

  const handlePaymentSuccess = () => {
    onPaymentSuccess?.();
    onClose();
  };

  const handlePaymentError = (error: any) => {
    onPaymentError?.(error);
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Application Fee Payment</DialogTitle>
        </DialogHeader>
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: appearance as Appearance }}
        >
          <CheckoutForm 
            onClose={onClose}
            amount={amount}
            currency={currency}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default DepositComponent;
