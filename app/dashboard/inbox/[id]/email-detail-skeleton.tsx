import { Skeleton } from "@/components/ui/skeleton";

export const EmailDetailSkeleton = () => {
  return (
    <div className="layout">
      <div className="space-y-6">
        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" /> {/* Back button */}
          <div className="flex items-center gap-2">
            {/* Action icons */}
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-10 rounded-md" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Email Header */}
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" /> {/* Subject */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" /> {/* Name */}
                <Skeleton className="h-4 w-56" /> {/* Email */}
              </div>
              <Skeleton className="h-4 w-24" /> {/* Date */}
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ))}
          </div>

          {/* Attachments Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-32" /> {/* Attachments header */}
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg"
                >
                  <Skeleton className="h-4 w-4" /> {/* File icon */}
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-1" /> {/* File name */}
                    <Skeleton className="h-4 w-24" /> {/* File size */}
                  </div>
                  <Skeleton className="h-9 w-24" /> {/* Download button */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
