import LandlordReferenceForm from "@/app/landlord/landlord-reference-form"

interface LandlordReferenceProps {
  params: {
    id: string;
  };
}

export default function LandlordReference({ params }: LandlordReferenceProps) {
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <LandlordReferenceForm id={params.id} />
    </main>
  )
}

