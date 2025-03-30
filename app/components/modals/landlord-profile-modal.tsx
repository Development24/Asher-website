"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, Home } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { Landlord, Property } from "@/services/property/types";
import { useGetLandlordProperties } from "@/services/property/propertyFn";

// interface Property {
//   id: number
//   title: string
//   image: string
//   price: string
//   location: string
//   specs: {
//     size: string
//     bedrooms: number
//     bathrooms: number
//   }
// }

interface LandlordProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  landlord: Partial<Landlord>;
  onChatClick: () => void;
  onEmailClick: () => void;
}

export function LandlordProfileModal({
  isOpen,
  onClose,
  landlord,

  onChatClick,
  onEmailClick
}: LandlordProfileModalProps) {
  const router = useRouter();
  const { isPropertySaved, toggleSaveProperty } = useSavedProperties();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: landlordProperties } = useGetLandlordProperties(
    String(landlord.id)
  );
  const properties = landlordProperties?.properties;
  console.log(properties);

  const nextProperty = () => {
    if (currentIndex < properties?.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const previousProperty = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleViewProperty = (propertyId: number) => {
    onClose(); // Close the modal first
    router.push(`/property/${propertyId}`);
  };

  const handleSaveProperty = (e: React.MouseEvent, property: Property) => {
    e.preventDefault();
    e.stopPropagation();
    // toggleSaveProperty({
    //   id: property.id,
    //   image: property.image,
    //   title: property.title,
    //   price: property.price,
    //   location: property.location,
    // })
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full relative",
                    "ring-4",
                    landlord?.isActive ? "ring-red-500" : "ring-gray-300"
                  )}
                >
                  <Image
                    src={landlord?.image || "/placeholder.svg"}
                    alt={landlord?.name || ""}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                {landlord?.isActive && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{landlord?.name}</h2>
                <p className="text-sm text-gray-500">{landlord?.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900"
              onClick={onChatClick}
            >
              Chat
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={onEmailClick}
            >
              Email
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Listed properties</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousProperty}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextProperty}
                  disabled={currentIndex === properties?.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties && properties.length > 0 ? (
                properties
                  ?.slice(currentIndex, currentIndex + 2)
                  .map((property: any) => (
                    <div key={property?.property.id} className="relative group">
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={
                            property?.property?.images[0] || "/placeholder.svg"
                          }
                          alt={property?.property?.name}
                          fill
                          className="object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white z-10"
                          onClick={(e) =>
                            handleSaveProperty(e, property?.property)
                          }
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              isPropertySaved(Number(property?.property?.id)) &&
                                "fill-red-600 text-red-600"
                            )}
                          />
                        </Button>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Button
                          className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 text-gray-900"
                          size="sm"
                          onClick={() =>
                            handleViewProperty(Number(property?.property?.id))
                          }
                        >
                          View property
                        </Button>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-semibold">
                          {property?.property?.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {property?.property?.city}
                        </p>
                        <p className="text-red-600 font-semibold mt-1">{`${formatPrice(
                          Number(property?.property?.rentalFee)
                        )}`}</p>
                        <div className="text-sm text-gray-500 mt-1">
                          {property?.property?.noBedRoom} bedrooms •{" "}
                          {property?.property?.noBathRoom} bathrooms •{" "}
                          {property?.property?.propertysize}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
                  <Home className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Properties Listed
                  </h3>
                  <p className="text-sm text-gray-500 text-center max-w-sm">
                    This landlord hasn't listed any properties yet. Check back later for new listings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
