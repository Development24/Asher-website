"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleApplication } from "@/services/application/applicationFn";
import { useReuseAbleStore } from "@/store/reuseAble";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApplicationForm } from "./application-form";

const ApplicationPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  // const applicationInviteId = searchParams.get("applicationInviteId");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // Use the appropriate ID for your API call
  const idToUse = applicationId;
  // Get applicationId from all possible sources
  // const pathApplicationId = pathname.includes("progress") ? pathname.split("/").pop() : null;
  // const queryApplicationId = searchParams.get("applicationId");
  // const storeApplicationId = useReuseAbleStore((state: any) => state.applicationId);
  
  // Use the first available applicationId
  // const applicationId = storeApplicationId || queryApplicationId || pathApplicationId;
  // Fetch application data
  
  const { data: applicationData, isFetching: isApplicationFetching, refetch } = useGetSingleApplication(
    idToUse as string,
  );

  // Show skeleton while loading
  if (isApplicationFetching) {
    return (
      <div className="layout">
        <div className="space-y-4">
          <Skeleton className="w-full h-[100px]" />
          <Skeleton className="w-full h-[400px]" />
          <Skeleton className="w-3/4 h-[50px]" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="w-full h-[200px]" />
            <Skeleton className="w-full h-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="">
        <div className="">
          <ApplicationForm
            onShowPaymentModal={() => setShowPaymentModal(true)}
            propertyId={id as string}
            applicationData={applicationData?.application}
            isApplicationFetching={isApplicationFetching}
            applicationId={applicationId as string}
            refetch={refetch}
          />
        </div>
      </div>

      {/* PaymentModal removed - using DepositComponent in ApplicationForm instead */}
    </div>
  );
};

export default ApplicationPage;
