"use client";

import Link from "next/link";
import { useGetRelatedListings } from "@/services/property/propertyFn";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedListingsSectionProps {
  propertyId: string;
  excludeListingId: string;
  className?: string;
}

export const RelatedListingsSection = ({ 
  propertyId, 
  excludeListingId, 
  className = "" 
}: RelatedListingsSectionProps) => {
  const { data: relatedListings, isLoading, error } = useGetRelatedListings(
    propertyId, 
    excludeListingId
  );
  
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !relatedListings || relatedListings.data.totalCount === 0) {
    return null;
  }
  
  const { units, rooms, totalCount } = relatedListings.data;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">
        Other Available Spaces in This Building
      </h3>
      
      <div className="space-y-4">
        {/* Units */}
        {units.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Units</h4>
            <div className="space-y-2">
              {units.map(unit => (
                <Link
                  key={unit.id}
                  href={unit.url}
                  className="block p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{unit.name}</span>
                    <span className="text-primary-500 font-semibold">
                      {formatPrice(unit.price, unit.currency)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Rooms */}
        {rooms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Rooms</h4>
            <div className="space-y-2">
              {rooms.map(room => (
                <Link
                  key={room.id}
                  href={room.url}
                  className="block p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{room.name}</span>
                    <span className="text-primary-500 font-semibold">
                      {formatPrice(room.price, room.currency)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href={`/search?propertyId=${propertyId}`}
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          View all {totalCount} available spaces →
        </Link>
      </div>
    </div>
  );
};
