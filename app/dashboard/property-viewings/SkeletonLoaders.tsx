import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full h-48" /> {/* Image skeleton */}
        <div className="p-4 space-y-4">
          <Skeleton className="h-6 w-3/4" /> {/* Title skeleton */}
          <Skeleton className="h-4 w-1/2" /> {/* Price skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-2/3" /> {/* Description line 2 */}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-full" /> {/* Button skeleton */}
          </div>
        </div>
      </div>
    );
  }
  
  export function SectionSkeleton({ count = 3 }) {
    return (
      <section className="mb-12">
        <Skeleton className="h-8 w-48 mb-4" /> {/* Section title skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          {Array(count)
            .fill(0)
            .map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
        </div>
      </section>
    );
  }