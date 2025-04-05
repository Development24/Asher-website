import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ApplicationCard from "./ApplicationCard";

interface ApplicationSectionProps {
  title: string;
  description: string;
  data: any[];
  isLoading: boolean;
  sectionType:
    | "continue"
    | "submitted"
    | "invite"
    | "completed"
    | "declined"
    | "payment";
  emptyMessage?: string;
}

const ApplicationSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="col-span-full">
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
        <Home className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No Applications Found
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">{message}</p>
      </div>
    </div>
  );
};

export function ApplicationSection({
  title,
  description,
  data,
  isLoading,
  sectionType,
  emptyMessage = "No applications found in this section. Check back later for updates."
}: ApplicationSectionProps) {
  // console.log(data);
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <ApplicationSkeleton />
        ) : data?.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          data?.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ApplicationCard application={application} sectionType={sectionType as any} />
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
