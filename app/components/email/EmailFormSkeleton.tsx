
import { Skeleton } from "@/components/ui/skeleton";

// Add this loading skeleton component
export const EmailFormSkeleton = () => {
  return (
    <div className="layout">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="w-16 h-4" />
        <span className="text-gray-400">/</span>
        <Skeleton className="w-32 h-4" />
        <span className="text-gray-400">/</span>
        <Skeleton className="w-24 h-4" />
      </div>

      <div className="grid md:grid-cols-[1fr,400px] gap-8">
        {/* Form Section Skeleton */}
        <div>
          <Skeleton className="w-48 h-8 mb-6" /> {/* Title */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <Skeleton className="w-24 h-4 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="w-28 h-4 mb-2" />
                <Skeleton className="w-full h-10" />
              </div>
              <div>
                <Skeleton className="w-36 h-4 mb-2" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>

            {/* Address */}
            <div>
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>

            {/* Message */}
            <div>
              <Skeleton className="w-28 h-4 mb-2" />
              <Skeleton className="w-full h-[150px]" />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Skeleton className="w-24 h-10" />
              <Skeleton className="w-28 h-10" />
            </div>
          </div>
        </div>

        {/* Property Card Skeleton */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Skeleton className="w-full h-48" /> {/* Image */}
          <div className="p-4">
            <Skeleton className="w-3/4 h-6 mb-2" /> {/* Title */}
            <Skeleton className="w-2/3 h-4 mb-2" /> {/* Location */}
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-28 h-4" />
            </div>
            <Skeleton className="w-32 h-6" /> {/* Price */}
          </div>
        </div>
      </div>
    </div>
  );
};
