import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonLoader = () => {
  return (
    <div className="space-y-8">
      {/* Full name skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* Label skeleton */}
        <Skeleton className="h-12 w-full rounded-lg" /> {/* Input skeleton */}
      </div>

      {/* Property address and rent amount skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" /> {/* Label skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" /> {/* Input skeleton */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" /> {/* Label skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" /> {/* Input skeleton */}
        </div>
      </div>

      {/* Tenancy start date skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" /> {/* Label skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full rounded-lg" />{" "}
          {/* Day select skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" />{" "}
          {/* Month select skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" />{" "}
          {/* Year select skeleton */}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
