import { Skeleton } from "@/components/ui/skeleton";

function PropertyCardSkeleton() {
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
    )
  }
  
export function PropertyViewingDetailSkeleton() {
    return (
      <div className="layout">
        {/* Gallery Section Skeleton */}
        <div className="relative h-[600px] bg-gray-200 animate-pulse">
          {/* Gallery Navigation Skeleton */}
          <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton key={index} className="w-24 h-24 rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>
  
        <div className="layout">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-16" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-32" />
          </div>
  
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Title and Location Skeleton */}
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3 mt-4" />
                </div>
  
                {/* Description Skeleton */}
                <section>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </section>
  
                {/* Features Skeleton */}
                <section>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Skeleton key={index} className="h-6 w-full" />
                    ))}
                  </div>
                </section>
  
                {/* Location Section Skeleton */}
                <section>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
                  <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((_, sectionIndex) => (
                      <div key={sectionIndex}>
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-2">
                          {[1, 2, 3].map((_, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
  
            {/* Right Column Skeleton */}
            <div className="space-y-6">
              {/* Schedule Box Skeleton */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-10" />
                      <Skeleton className="h-10" />
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Contact Agent Box Skeleton */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
  
          {/* Similar Properties Skeleton */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            <div className="flex gap-6">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex-none w-[300px]">
                  <PropertyCardSkeleton />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }