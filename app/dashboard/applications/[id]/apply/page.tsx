"use client";

import { useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ApplicationFormProvider } from "@/contexts/application-form-context";
import { ApplicationForm } from "./application-form";
import { PaymentModal } from "./payment-modal";
import { useGetSingleApplication } from "@/services/application/applicationFn";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const applicationId =
    searchParams.get("applicationId") ||
    (pathname.includes("progress") ? pathname.split("/").pop() : null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { data: applicationData, isFetching: isApplicationFetching } =
    useGetSingleApplication(applicationId as string);
  console.log("applicationID is here", applicationId);
  const validAplicationId = applicationId ?? applicationData?.application?.id;
  // if (isApplicationFetching) {
  //   return <Skeleton className="w-full h-[250px]" />;
  // }
  // console.log(id);
  return (
    <div className="layout">
      <div className="">
        <div className="">
          <ApplicationForm
            onShowPaymentModal={() => setShowPaymentModal(true)}
            propertyId={id as string}
            applicationData={applicationData?.application}
            isApplicationFetching={isApplicationFetching}
            applicationId={validAplicationId}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        propertyId={id as string}
      />
    </div>
  );
}
