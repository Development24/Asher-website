"use client";
import LandlordReferenceForm from "@/app/landlord/landlord-reference-form";
import { useGetReferenceDetails } from "@/services/application/applicationFn";

interface LandlordReferenceProps {
  params: {
    id: string;
  };
}

export default function LandlordReference({ params }: LandlordReferenceProps) {
  const { id } = params;
  const { data: applicationData, isFetching: isApplicationFetching } =
    useGetReferenceDetails(id as string);
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <LandlordReferenceForm
        applicationData={applicationData?.application}
        loading={isApplicationFetching}
      />
    </main>
  );
}
