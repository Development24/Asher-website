"use client";
import EmployeeReferenceForm from "@/app/employer/employee-reference-form";
import { useGetSingleApplication } from "@/services/application/applicationFn";
interface EmployerReferenceProps {
  params: {
    id: string;
  };
}
export default function Home({ params }: EmployerReferenceProps) {
  const { id } = params;
  const { data: applicationData, isFetching: isApplicationFetching } =
    useGetSingleApplication(id as string);
  console.log(applicationData);
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <EmployeeReferenceForm
        applicationData={applicationData?.application}
        loading={isApplicationFetching}
      />
    </main>
  );
}
