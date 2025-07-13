import { motion } from 'framer-motion';
import { Skeleton } from './skeleton';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced skeleton components with consistent styling
export const LoadingStates = {
  // Card skeleton with consistent styling
  Card: ({ className }: { className?: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 shadow-sm p-6",
        className
      )}
    >
      <Skeleton className="h-48 w-full rounded-lg mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </motion.div>
  ),

  // Property card skeleton
  PropertyCard: ({ className }: { className?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden",
        className
      )}
    >
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </motion.div>
  ),

  // List item skeleton
  ListItem: ({ className }: { className?: string }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200",
        className
      )}
    >
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" />
    </motion.div>
  ),

  // Form skeleton
  Form: ({ className }: { className?: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-6", className)}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </motion.div>
  ),

  // Table skeleton
  Table: ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-20" />
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-neutral-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  ),

  // Grid skeleton
  Grid: ({ 
    items = 6, 
    columns = 3, 
    className 
  }: { 
    items?: number; 
    columns?: number; 
    className?: string 
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        `grid gap-6`,
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: items }).map((_, index) => (
        <LoadingStates.Card key={index} />
      ))}
    </motion.div>
  ),

  // Spinner component
  Spinner: ({ 
    size = "default", 
    className 
  }: { 
    size?: "sm" | "default" | "lg"; 
    className?: string 
  }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8"
    };

    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={cn(sizeClasses[size], className)}
      >
        <Loader2 className="h-full w-full text-primary-500" />
      </motion.div>
    );
  },

  // Page loading skeleton
  Page: ({ className }: { className?: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingStates.Card key={index} />
        ))}
      </div>
    </motion.div>
  )
};

// Loading overlay component
export const LoadingOverlay = ({ 
  isLoading, 
  children 
}: { 
  isLoading: boolean; 
  children: React.ReactNode 
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <LoadingStates.Spinner size="lg" />
          <p className="text-neutral-600 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
};

// Staggered loading animation wrapper
export const StaggeredContainer = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggeredItem = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
); 