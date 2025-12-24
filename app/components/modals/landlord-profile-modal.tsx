"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, Home } from "lucide-react";
import { cn, getPropertyPrice, getBedroomCount, getBathroomCount } from "@/lib/utils";
import { FormattedPrice } from "@/components/FormattedPrice";
import { displayImages } from "@/app/property/[id]/utils";
import { animations } from "@/lib/animations";
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

const LandlordProfileModal = ({ isOpen, onClose, landlord, onChatClick, onEmailClick }: LandlordProfileModalProps) => {
  const router = useRouter();
  const { isPropertySaved, toggleSaveProperty } = useSavedProperties();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: landlordProperties } = useGetLandlordProperties(
    String(landlord.id)
  );
  const properties = landlordProperties?.properties;

  const nextProperty = () => {
    if (currentIndex < (properties?.length || 0) - 2) {
      setCurrentIndex((prev) => prev + 2);
    }
  };

  const previousProperty = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 2);
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
      <DialogContent className="sm:max-w-[830px] p-0 overflow-hidden max-h-[90vh]">
        <div className="p-3 overflow-hidden max-h-[90vh] overflow-y-auto">
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
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-user.jpg"; }}
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
              <div className="flex items-center gap-4">
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
                    disabled={currentIndex >= (properties?.length || 0) - 2}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {properties && properties.length > 1 && (
                  <div className="flex gap-1">
                    {properties.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors duration-200",
                          index === currentIndex ? "bg-red-600" : "bg-gray-300"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden px-1">
              {properties && properties.length > 0 ? (
                <div className="flex gap-3 transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 50}%)` }}>
                  {properties.map((property: any, index: number) => (
                    <motion.div 
                      key={property?.property.id} 
                      className="relative group bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-shadow duration-200 w-[calc(50%-10px)] flex-shrink-0"
                      whileHover={{ 
                        scale: 1.01, 
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{ willChange: 'transform' }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={
                            displayImages(property?.property?.images)[0] || "/placeholder.svg"
                          }
                          alt={property?.property?.name}
                          fill
                          className="object-cover"
                          onError={(e) => { 
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = "/placeholder.svg"; 
                          }}
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
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <Button
                          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                          size="sm"
                          onClick={() =>
                            handleViewProperty(Number(property?.property?.id))
                          }
                        >
                          View property
                        </Button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-neutral-900 mb-1 line-clamp-1">
                          {property?.property?.name}
                        </h4>
                        <p className="text-sm text-neutral-600 mb-2 line-clamp-1">
                          {property?.property?.city}
                        </p>
                        <FormattedPrice
                          amount={property?.property?.price}
                          currency={property?.property?.currency || 'USD'}
                          className="text-primary-500 font-semibold mb-2"
                        />
                        <div className="flex items-center gap-3 text-sm text-neutral-600">
                          <span className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                            {property?.bedrooms || property?.property?.bedrooms || 1} bed{(property?.bedrooms || property?.property?.bedrooms || 1) !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                            {property?.bathrooms || property?.property?.bathrooms || 1} bath{(property?.bathrooms || property?.property?.bathrooms || 1) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
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
};
export default LandlordProfileModal;
