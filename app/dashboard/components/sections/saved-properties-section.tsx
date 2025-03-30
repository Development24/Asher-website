import EmptyState from "@/app/components/EmptyState";
import { PropertyCard } from "../property-card";
import { PropertyCardSkeleton } from "../property-card-skeleton";
import { Heart } from "lucide-react";
import Link from "next/link";

interface SavedPropertiesSectionProps {
  isLoading: boolean;
  savedProperties: any[];
}

export function SavedPropertiesSection({
  isLoading,
  savedProperties
}: SavedPropertiesSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Saved properties</h2>
        <Link
          href="/dashboard/saved-properties"
          className="text-sm text-red-600 hover:text-red-700"
        >
          View all
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </>
        ) : savedProperties?.length > 0 ? (
          savedProperties
            .slice(0, 3)
            .map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                property={property}
                showViewProperty
              />
            ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-10">
            <EmptyState emptyText="No saved properties" />
          </div>
        )}
      </div>
    </section>
  );
}
