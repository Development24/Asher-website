'use client'
import GuarantorForm from "@/app/guarantor/guarantor-form";
import { useGetReferenceDetails } from "@/services/application/applicationFn";

interface HomeInterface {
  params: {
    id: string;
  };
}
export default function Home({ params }: HomeInterface) {
  const { id } = params;
  const { data: applicationData, isFetching: isApplicationFetching } =
  useGetReferenceDetails(id as string);
  console.log(applicationData);


  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
  
        <GuarantorForm applicationData={applicationData?.application} loading={isApplicationFetching}/>

    </main>
  )
}

