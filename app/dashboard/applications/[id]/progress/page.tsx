"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useMilestonesApplication } from "@/services/application/applicationFn";
import { ApplicationData } from "@/types/applicationInterface";
import { Bath, Bed, Check, MapPin } from "lucide-react";
import { FormattedPrice } from "@/components/FormattedPrice";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const FeedbackModal = dynamic(() => import("@/app/dashboard/components/modals/feedback-modal").then(mod => mod.default), { ssr: false, loading: () => null });
import { completedStep } from "../../components/ApplicationCard";
// formatPrice removed - using FormattedPrice component instead
import { format } from "date-fns";
import { useReuseAbleStore } from "@/store/reuseAble";
import { useApplicationForm } from "@/contexts/application-form-context";

interface Milestone {
  title: string;
  date: string;
  description: string;
  completed: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
  specs: {
    size: string;
    beds: number;
    baths: number;
  };
  completionStatus: number;
  description: string;
}

interface MileStoneData {
  id: string;
  subjects: string | null;
  viewAgain: string | null;
  considerRenting: string | null;
  events: string;
  type: string;
  status: string | null;
  createdAt: string;
  propertyId: string;
  applicationId: string;
  transactionId: string | null;
  createdById: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
// First, let's create a MilestoneSkeleton component using Shadcn's Skeleton
const MilestoneSkeleton = () => (
  <div className="flex gap-4 mb-8">
    <div className="relative">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="absolute top-8 left-1/2 bottom-[-32px] w-0.5 -translate-x-1/2 bg-gray-200" />
    </div>
    <div className="flex-1 pt-1 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-8 w-24 shrink-0" />
      </div>
    </div>
  </div>
);

// Property Card Skeleton Component
const PropertyCardSkeleton = () => (
  <Card className="h-full">
    <Skeleton className="h-64 rounded-t-lg" /> {/* Image skeleton */}
    <div className="p-4 flex flex-col gap-5">
      {/* Title and location */}
      <div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Price */}
      <Skeleton className="h-6 w-1/3" />

      {/* Specs */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Description */}
      <Skeleton className="h-20 w-full" />

      {/* Progress section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

/**
 * Application Progress Page
 * 
 * Displays the progress of a property rental application, including:
 * - Property details (image, name, location, price, specs)
 * - Application completion status
 * - Application milestones/timeline (from API milestones or Log array)
 * 
 * Data Sources:
 * - Milestones: API endpoint returns milestones array, falls back to application.Log if empty
 * - Property: Can be normalized (listing.property) or raw (properties) structure
 */
export default function ApplicationProgressPage() {
  // ==================== Route & Query Parameters ====================
  const { id } = useParams(); // Property ID from URL path
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId"); // Application ID from query params
  
  // ==================== Component State ====================
  const [milestones, setMilestones] = useState<Milestone[]>([]); // Default milestones if no API data
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { loadDraft } = useApplicationForm();

  // ==================== Data Fetching ====================
  /**
   * Fetch application milestones and application data
   * Endpoint: /api/application/milestones/:propertyId/:applicationId
   * Returns: { milestones: [], application: ApplicationData }
   */
  const { data: milestonesData, isFetching: isMilestonesFetching } =
    useMilestonesApplication(id as string, applicationId as string);

  const propertyData = milestonesData?.application as ApplicationData;

  // ==================== Milestones Data Processing ====================
  /**
   * Extract milestones with fallback strategy:
   * 1. Use API milestones array if available and non-empty
   * 2. Fallback to application.Log array (activity log)
   * 3. Map Log entries to MileStoneData format for consistent rendering
   * 4. Return empty array if neither source has data
   */
  const milestonesApplication = (() => {
    // Priority 1: Use API milestones if available
    if (milestonesData?.milestones && milestonesData.milestones.length > 0) {
      return milestonesData.milestones as MileStoneData[];
    }
    
    // Priority 2: Fallback to application Log array
    if (propertyData?.Log && propertyData.Log.length > 0) {
      return propertyData.Log.map((log: any) => ({
        id: log.id || '',
        subjects: log.subjects || null,
        viewAgain: log.viewAgain || null,
        considerRenting: log.considerRenting || null,
        events: log.events || log.type || 'Activity',
        type: log.type || '',
        status: log.status || null,
        createdAt: log.createdAt || log.timestamp || new Date().toISOString(),
        propertyId: log.propertyId || id as string,
        applicationId: log.applicationId || applicationId || '',
        transactionId: log.transactionId || null,
        createdById: log.createdById || '',
      })) as MileStoneData[];
    }
    
    // No milestones available
    return [];
  })();

  // ==================== Property Data Normalization ====================
  /**
   * Handle both normalized and raw property data structures:
   * - Normalized: { listing: { listingEntity, property } } (from normalizers)
   * - Raw: { properties: { ... } } (direct from API)
   * 
   * This ensures compatibility with both data structures throughout the component
   */
  const listing = (propertyData as any)?.listing || null;
  const isNormalized = listing?.listingEntity && listing?.property;
  const listingEntity = listing?.listingEntity || null;
  const hierarchy = listing?.hierarchy || null;
  const property = isNormalized 
    ? listing.property 
    : propertyData?.properties || null;
  // Keep reference to original property data for fallback (bedrooms/bathrooms might be there)
  const originalProperty = propertyData?.properties || null;
  
  // ==================== Property Details Extraction ====================
  
  /**
   * Extract property/room/unit name with fallbacks
   * For normalized listings: use listingEntity.name (room/unit name) with property context
   * For raw data: use property name
   */
  const propertyName = isNormalized && listingEntity?.name
    ? listingEntity.name
    : property?.name || property?.title || '';
  
  // Property context name (for showing "Room Name in Property Name")
  const propertyContextName = isNormalized && hierarchy?.level !== 'property' && listing?.property?.name
    ? listing.property.name
    : null;
  
  /**
   * Extract property image with comprehensive handling:
   * - For normalized listings: prioritize listingEntity images, fallback to property images
   * - For raw data: use property images
   * - Falls back to placeholder.co with property name first letter
   * - Format: Black background (000000), white text (FFFFFF)
   */
  let propertyImages: any[] = [];
  if (isNormalized && listingEntity?.images?.length > 0) {
    propertyImages = listingEntity.images;
  } else if (isNormalized && listing?.property?.images?.length > 0) {
    propertyImages = listing.property.images;
  } else {
    propertyImages = property?.images || property?.imageUrls || [];
  }
  
  let propertyImage = '';
  if (propertyImages.length > 0) {
    const firstImage = propertyImages[0];
    // Handle both string and object formats
    propertyImage = typeof firstImage === 'string' 
      ? firstImage 
      : firstImage?.url || firstImage?.imageUrl || '';
  }
  
  // Generate placeholder if no image available
  if (!propertyImage && propertyName) {
    const firstLetter = propertyName.charAt(0).toUpperCase();
    propertyImage = `https://placehold.co/400x300/000000/FFFFFF?text=${encodeURIComponent(firstLetter)}`;
  } else if (!propertyImage) {
    propertyImage = 'https://placehold.co/400x300/000000/FFFFFF?text=P';
  }
  
  /**
   * Extract location details (always from property context)
   */
  const propertyCity = isNormalized 
    ? (listing?.property?.city || '')
    : (property?.city || '');
  const propertyCountry = isNormalized
    ? (listing?.property?.country || '')
    : (property?.country || '');
  // Handle state - can be object {id, name} or string
  const propertyState = (() => {
    if (isNormalized) {
      const state = listing?.property?.state;
      if (state) {
        return typeof state === 'object' && state !== null 
          ? (state.name || state.id || '')
          : (typeof state === 'string' ? state : '');
      }
    }
    const state = property?.state;
    if (state) {
      return typeof state === 'object' && state !== null
        ? (state.name || state.id || '')
        : (typeof state === 'string' ? state : '');
    }
    return '';
  })();
  
  /**
   * Extract pricing information
   * For normalized listings: use listing price (from listingEntity or listing)
   * For raw data: use property price
   */
  const propertyRentalFee = isNormalized
    ? (listing?.price || listingEntity?.entityPrice || listing?.property?.price || 0)
    : (property?.rentalFee || property?.price || 0);
  const propertyCurrency = isNormalized
    ? (listing?.property?.currency || 'USD')
    : (property?.currency || 'USD');
  const propertyPriceFrequency = isNormalized
    ? (listing?.priceFrequency || listingEntity?.entityPriceFrequency || listing?.property?.priceFrequency || null)
    : (property?.priceFrequency || null);
  
  /**
   * Extract bedrooms count with comprehensive fallback strategy
   * Priority order:
   * 1. Normalized listing property context (works for all listing types)
   * 2. Normalized listing specification (for entire properties)
   * 3. Raw property direct fields (noBedRoom, bedrooms)
   * 4. Raw property nested specification (residential.bedrooms)
   * 5. Default to 0 if not found
   */
  const bedrooms = (() => {
    // Check normalized listing data first (if available)
    if (listing?.property?.bedrooms != null) {
      return listing.property.bedrooms;
    }
    if (listing?.specification?.residential?.bedrooms != null) {
      return listing.specification.residential.bedrooms;
    }
    
    // Check raw property direct fields (most common in API responses)
    if (property?.noBedRoom != null) {
      return property.noBedRoom;
    }
    if (property?.bedrooms != null) {
      return property.bedrooms;
    }
    
    // Check nested specification (can be array or object)
    if (property?.specification) {
      const spec = property.specification;
      const residential = Array.isArray(spec)
        ? spec.find((s: any) => s?.residential || s?.specificationType === 'RESIDENTIAL')?.residential
        : spec?.residential;
      if (residential?.bedrooms != null) {
        return residential.bedrooms;
      }
    }
    
    // Check direct residential object
    if (property?.residential?.bedrooms != null) {
      return property.residential.bedrooms;
    }
    
    // Default fallback
    return 0;
  })();

  /**
   * Extract bathrooms count with comprehensive fallback strategy
   * Same priority order as bedrooms
   */
  const bathrooms = (() => {
    // Check normalized listing data first (if available)
    if (listing?.property?.bathrooms != null) {
      return listing.property.bathrooms;
    }
    if (listing?.specification?.residential?.bathrooms != null) {
      return listing.specification.residential.bathrooms;
    }
    
    // Check raw property direct fields (most common in API responses)
    // Use originalProperty for fallback when normalized
    const propToCheck = isNormalized ? originalProperty : property;
    if (propToCheck?.noBathRoom != null) {
      return propToCheck.noBathRoom;
    }
    if (propToCheck?.bathrooms != null) {
      return propToCheck.bathrooms;
    }
    
    // Check nested specification (can be array or object)
    if (propToCheck?.specification) {
      const spec = propToCheck.specification;
      const residential = Array.isArray(spec)
        ? spec.find((s: any) => s?.residential || s?.specificationType === 'RESIDENTIAL')?.residential
        : spec?.residential;
      if (residential?.bathrooms != null) {
        return residential.bathrooms;
      }
    }
    
    // Check direct residential object
    if (propToCheck?.residential?.bathrooms != null) {
      return propToCheck.residential.bathrooms;
    }
    
    // Default fallback
    return 0;
  })();

  /**
   * Extract property size with fallbacks
   * Handles both propertysize (API format) and size (alternative format)
   */
  const propertySize = property?.propertysize || property?.size || '';

  // ==================== Event Handlers ====================
  
  /**
   * Open feedback modal for the property
   * Only enabled if property data is available
   */
  const openFeedbackModal = useCallback(() => {
    if (property) {
      setShowFeedbackModal(true);
    }
  }, [property]);

  // ==================== Effects ====================
  
  /**
   * Initialize default milestones and load application draft
   * 
   * Default milestones are only set if:
   * - No milestones from API
   * - No Log entries available
   * - Property data is available
   */
  useEffect(() => {
    // Set default milestones as fallback if no API/Log data available
    if (milestones.length === 0 && milestonesApplication.length === 0 && propertyData && propertyName) {
      setMilestones([
        {
          title: "Application Started",
          date: propertyData.createdAt 
            ? format(new Date(propertyData.createdAt), "MMM d, yyyy") 
            : "Pending",
          description: `Application in progress for ${propertyName}.`,
          completed: true
        },
        {
          title: "Property Viewed",
          date: "Pending",
          description: "You viewed the property. Don't forget to leave your feedback!",
          completed: false,
          action: {
            label: "Leave feedback",
            onClick: openFeedbackModal
          }
        },
        {
          title: "Documents Submitted",
          date: "Pending",
          description: "All required documents have been uploaded and submitted.",
          completed: false
        },
        {
          title: "Application Review",
          date: "Pending",
          description: "Your application is under review by the property manager.",
          completed: false
        },
        {
          title: "Final Decision",
          date: "Pending",
          description: "Awaiting final decision on your application.",
          completed: false
        }
      ]);
    }

  }, [
    id,
    applicationId,
    propertyData,
    propertyName,
    milestones.length,
    milestonesApplication.length,
    openFeedbackModal
  ]);

  /**
   * Handle feedback submission completion
   * Updates the "Property Viewed" milestone to reflect feedback was submitted
   */
  const handleFeedbackComplete = () => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.title === "Property Viewed"
          ? {
              ...milestone,
              description: "You viewed the property and left feedback.",
              action: undefined // Remove action button after feedback is submitted
            }
          : milestone
      )
    );
    setShowFeedbackModal(false);
  };

  /**
   * Navigate to application form to resume/continue application
   */
  const handleResumeApplication = () => {
    router.push(`/dashboard/applications/${id}/apply`);
  };

  // ==================== Loading State ====================
  /**
   * Show skeleton loading state while:
   * - Property data is not available, OR
   * - Milestones are still being fetched
   */
  if (!property || isMilestonesFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Skeleton className="h-4 w-20" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-24" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-8" />

          <div className="grid md:grid-cols-[400px,1fr] gap-8">
            {/* Property Card Skeleton */}
            <Card className="h-full">
              <Skeleton className="h-64 rounded-t-lg" />
              <div className="p-4 flex flex-col gap-5">
                <div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
                <Skeleton className="h-6 w-1/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>

            {/* Timeline Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="relative">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex gap-4 mb-8">
                    <div className="relative">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      {index < 4 && (
                        <div className="absolute top-8 left-1/2 bottom-[-32px] w-0.5 -translate-x-1/2 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-full">
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-2" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                        <Skeleton className="h-8 w-24 shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/dashboard/applications"
          className="text-gray-600 hover:text-gray-900"
        >
          Applications
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Application progress</span>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Track Application</h1>
        <p className="text-gray-500 mb-8">
          Keep an eye on your application progress with a clear overview of
          every step, from inquiry to final decision.
        </p>

        <div className="grid md:grid-cols-[400px,1fr] gap-8">
          {/* Property Card */}
          {isMilestonesFetching ? (
            <PropertyCardSkeleton />
          ) : (
            property && (
              <Card className="h-full">
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={propertyImage}
                    alt={propertyName || 'Property'}
                    fill
                    className="object-cover rounded-t-lg"
                    unoptimized
                  />
                </div>
                <div className="p-4 flex flex-col gap-5">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {propertyName}
                      {propertyContextName && (
                        <span className="text-sm font-normal text-gray-500 block mt-1">
                          in {propertyContextName}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {propertyCity && propertyCountry 
                        ? `${propertyCity}, ${propertyCountry}`
                        : propertyState && propertyCountry
                        ? `${propertyState}, ${propertyCountry}`
                        : propertyCountry || 'Location not available'}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    <FormattedPrice
                      amount={Number(propertyRentalFee)}
                      currency={propertyCurrency}
                    />
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      / month
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    {/* Bedrooms display - only show if value > 0, otherwise show N/A */}
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {bedrooms > 0 
                        ? `${bedrooms} bed${bedrooms !== 1 ? 's' : ''}` 
                        : 'N/A'}
                    </span>
                    {/* Bathrooms display - only show if value > 0, otherwise show N/A */}
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {bathrooms > 0 
                        ? `${bathrooms} bath${bathrooms !== 1 ? 's' : ''}` 
                        : 'N/A'}
                    </span>
                    {/* Property size - only display if available */}
                    {propertySize && <span>{propertySize}</span>}
                  </div>
                  {property?.description && (
                  <p className="text-sm text-gray-600">
                      {property.description}
                  </p>
                  )}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      Application completion
                    </div>
                    <Progress
                      value={completedStep(propertyData?.completedSteps?.length || 0)}
                      className="h-2"
                    />
                    <div className="text-sm font-medium">
                      {completedStep(propertyData?.completedSteps?.length || 0)}%
                      complete
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/applications/${id}/apply/?applicationId=${applicationId}`}
                  >
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Resume application
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          )}

          {/* Timeline */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Application milestone</h2>
            <div className="relative">
              {isMilestonesFetching
                ? Array.from({ length: 5 }).map((_, index) => (
                    <MilestoneSkeleton key={index} />
                  ))
                : milestonesApplication && milestonesApplication.length > 0
                ? milestonesApplication.map((milestone, index) => (
                    <div key={milestone.id || index} className="flex gap-4 mb-8">
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone?.status === "COMPLETED"
                              ? "bg-red-600 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                        {index < milestonesApplication.length - 1 && (
                          <div className="absolute top-8 left-1/2 bottom-[-32px] w-0.5 -translate-x-1/2 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{milestone?.events || milestone?.type || 'Activity'}</h3>
                            <div className="text-sm text-gray-500">
                              <span>on</span>
                              <span className="ml-1">
                                {milestone?.createdAt
                                  ? format(new Date(milestone.createdAt), "MMM d, yyyy")
                                  : 'Pending'}
                              </span>
                            </div>
                            {milestone?.subjects && (
                              <p className="text-sm text-gray-600 mt-1">
                                {milestone.subjects}
                              </p>
                            )}
                          </div>
                          {milestone.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => milestone.action?.onClick()}
                              className="shrink-0"
                            >
                              {milestone.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                : milestones && milestones.length > 0
                ? milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-4 mb-8">
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.completed
                              ? "bg-red-600 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                        {index < milestones.length - 1 && (
                          <div className="absolute top-8 left-1/2 bottom-[-32px] w-0.5 -translate-x-1/2 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{milestone.title}</h3>
                            <div className="text-sm text-gray-500">
                              <span>{milestone.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {milestone.description}
                            </p>
                          </div>
                          {milestone.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => milestone.action?.onClick()}
                              className="shrink-0"
                            >
                              {milestone.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No milestones available yet.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {property && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          property={property as any}
          onComplete={handleFeedbackComplete}
        />
      )}
    </div>
  );
}
