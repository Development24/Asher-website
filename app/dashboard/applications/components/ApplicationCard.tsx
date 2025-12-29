import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ApplicationData } from "@/types/applicationInterface";
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bed, Bath } from "lucide-react";
import { FormattedPrice } from "@/components/FormattedPrice";
import { useReuseAbleStore } from "@/store/reuseAble";
import { ApplicationStatus } from "../page";
import { displayImages } from "@/app/property/[id]/utils";

const getStatusBadgeColor = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.APPROVED:
    case ApplicationStatus.COMPLETED:
    case ApplicationStatus.AGREEMENTS_SIGNED:
      return "bg-green-100 text-green-800";
    case ApplicationStatus.SUBMITTED:
      return "bg-blue-100 text-blue-800";
    case ApplicationStatus.DECLINED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// completed when the stepCompleted is 6
export const completedStep = (number: number) => {
  if (number >= 7) {
    return 100;
  }
  switch (number) {
    case 7:
      return 100;
    case 6:
      return 80;
    case 5:
      return 60;
    case 4:
      return 40;
    case 3:
      return 35;
    case 2:
      return 20;
    case 1:
      return 10;
    default:
      return 0;
  }
};

const ApplicationCard = ({
  application,
  sectionType
}: {
  application: ApplicationData & {
    draftId?: number;
    lastUpdated?: string;
  };
  sectionType:
    | "continue"
    | "ongoing"
    | "invite"
    | "submitted"
    | "completed"
    | "declined";
}) => {
  // const {
  //   setApplicationInvitedId,
  //   setApplicationId,
  //   applicationInvitedId,
  //   applicationId
  // } = useReuseAbleStore((state: any) => state);

  // useEffect(() => {
  //   if ( application?.applicationInviteId || application?.id) {
  //     setApplicationInvitedId(
  //       application?.applicationInviteId ?? application?.id
  //     );
  //   }
  // }, [application?.applicationInviteId, application?.id]);

  // useEffect(() => {
  //   if (application?.id) {
  //     setApplicationId(application.id);
  //   }
  // }, [application?.id]);

  // const getNavigationUrl = () => {
  //   if (sectionType === "ongoing") {
  //     const status = application?.status?.toLowerCase();

  //     return `/dashboard/applications/${application?.id}/${status}?applicationId=${application?.id}`;
  //   }

  //   if (sectionType === "continue") {
  //     return `/dashboard/applications/${application?.properties?.id}/progress?applicationId=${application?.id}`;
  //   }

  //   if (sectionType === "submitted" || sectionType === "completed") {
  //     return `/dashboard/applications/${application?.id}/submitted?applicationId=${application?.id}`;
  //   }

  //   return `/dashboard/applications/${application?.properties?.id}/apply?applicationInviteId=${application?.applicationInviteId || application?.id}`;
  // }

  const getNavigationUrl = (
    application: ApplicationData,
    sectionType: string
  ) => {
    // CRITICAL: These are different IDs for different purposes:
    // - id/applicationId = The actual application ID (for existing applications)
    // - applicationInviteId = The invite ID (for starting new applications)
    // - propertiesId = The property ID (for URL path)
    
    // Get application ID (the actual application.id - used for existing applications)
    const applicationId = (application as any)?.id || (application as any)?.applicationId;
    
    // Get applicationInviteId (the invite ID - used for starting new applications)
    const applicationInviteId = (application as any)?.applicationInviteId || null;
    
    // Get property ID - prioritize propertiesId (preserved from original), then normalized listing, then fallback
    const propertyId = (application as any)?.propertiesId || // Preserved from original
                       application?.listing?.property?.id || // From normalized listing
                       application?.property?.id || // From normalized property
                       application?.properties?.id; // From raw properties
    
    if (!propertyId) {
      console.warn('Missing propertyId for application navigation:', application);
    }
    
    switch (application.status) {
      case ApplicationStatus.SUBMITTED:
        // Submitted: use applicationId in both path and query
        return `/dashboard/applications/${applicationId}/submitted?applicationId=${applicationId}`;
      case ApplicationStatus.COMPLETED:
      case ApplicationStatus.APPROVED:
        // Completed/Approved: use applicationId in both path and query
        return `/dashboard/applications/${applicationId}/completed?applicationId=${applicationId}`;
      case ApplicationStatus.DECLINED:
        // Declined: use applicationId in both path and query
        return `/dashboard/applications/${applicationId}/declined?applicationId=${applicationId}`;
      case ApplicationStatus.AGREEMENTS:
      case ApplicationStatus.AGREEMENTS_SIGNED:
        // Agreements: use applicationId in both path and query
        return `/dashboard/applications/${applicationId}/agreements?applicationId=${applicationId}`;
      case ApplicationStatus.PENDING:
        if (sectionType === "ongoing" || sectionType === "continue") {
          // For pending/ongoing applications: use propertyId in path, applicationId in query
          // This is for continuing an existing application
          if (!propertyId) {
            console.warn('Missing propertyId for ongoing application:', application);
            return `/dashboard/applications/${applicationId}/progress?applicationId=${applicationId}`;
          }
          if (!applicationId) {
            console.error('Missing applicationId for ongoing application:', application);
            return `/dashboard/applications/${propertyId}/progress`;
          }
          return `/dashboard/applications/${propertyId}/progress?applicationId=${applicationId}`;
        }
        // Fall through for pending invites
      default:
        // For invites/new applications: use propertyId in path, applicationInviteId in query
        // This is for starting a new application from an invite
        if (!propertyId) {
          console.warn('Missing propertyId for application invite:', application);
          return `/dashboard/applications/${applicationId || 'new'}/apply?applicationInviteId=${applicationInviteId || applicationId || ''}`;
        }
        if (!applicationInviteId && !applicationId) {
          console.error('Missing both applicationInviteId and applicationId for invite:', application);
          return `/dashboard/applications/${propertyId}/apply`;
        }
        // Use applicationInviteId if available (for new applications), otherwise fallback to applicationId
        return `/dashboard/applications/${propertyId}/apply?applicationInviteId=${applicationInviteId || applicationId}`;
    }
  };

  // Handle normalized structure
  const listing = application?.listing || null;
  const propertyData = application?.property || application?.properties || null;
  const isNormalized = listing?.listingEntity && listing?.property;
  
  // Extract data from normalized listing or fallback to property
  const images = isNormalized && listing?.listingEntity?.images?.length > 0
    ? listing.listingEntity.images
    : (isNormalized ? listing?.property?.images : null) || propertyData?.images || [];
  const name = isNormalized
    ? (listing.listingEntity?.name || listing.property?.name)
    : propertyData?.name || '';
  const price = isNormalized
    ? listing.price
    : (propertyData?.price || propertyData?.rentalFee || '0');
  const currency = isNormalized
    ? listing.property?.currency || 'USD'
    : propertyData?.currency || 'USD';
  const city = isNormalized
    ? listing.property?.city
    : propertyData?.city || '';
  const stateName = isNormalized
    ? listing.property?.state?.name
    : propertyData?.state?.name || '';
  const country = isNormalized
    ? listing.property?.country
    : propertyData?.country || '';
  // Extract bedrooms/bathrooms - check multiple paths for normalized listings
  // For normalized listings, check property context first (works for all types),
  // then specification (for entire properties), then fallback
  const bedrooms = isNormalized && listing
    ? (listing.property?.bedrooms ?? 
       listing.specification?.residential?.bedrooms ?? 
       propertyData?.bedrooms ?? 
       0)
    : (() => {
        // For legacy property data, check specification array or object
        const spec = propertyData?.specification;
        const residential = Array.isArray(spec) 
          ? spec.find((s: any) => s?.residential || s?.specificationType === 'RESIDENTIAL')?.residential
          : spec?.residential;
        return residential?.bedrooms ?? 
               propertyData?.residential?.bedrooms ?? 
               propertyData?.bedrooms ?? 
               propertyData?.noBedRoom ?? 
               propertyData?.bedRooms ?? 
               0;
      })();
  const bathrooms = isNormalized && listing
    ? (listing.property?.bathrooms ?? 
       listing.specification?.residential?.bathrooms ?? 
       propertyData?.bathrooms ?? 
       0)
    : (() => {
        // For legacy property data, check specification array or object
        const spec = propertyData?.specification;
        const residential = Array.isArray(spec) 
          ? spec.find((s: any) => s?.residential || s?.specificationType === 'RESIDENTIAL')?.residential
          : spec?.residential;
        return residential?.bathrooms ?? 
               propertyData?.residential?.bathrooms ?? 
               propertyData?.bathrooms ?? 
               propertyData?.noBathRoom ?? 
               propertyData?.bathRooms ?? 
               0;
      })();

  return (
    // NOTE: application is the application object
    <Card className="overflow-hidden flex flex-col justify-between min-h-[430px]">
      <div className="relative h-48">
        <Image
          src={
            displayImages(images)?.[0] ||
            "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg"
          }
          alt={name}
          fill
          className="object-cover"
        />
        {application.status && (
          <Badge
            className={`absolute top-2 right-2 ${getStatusBadgeColor(
              application.status as ApplicationStatus
            )}`}
          >
            {application.status.charAt(0).toUpperCase() +
              application.status.slice(1)}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{name}</h3>
          <FormattedPrice
            amount={Number(price)}
            currency={currency}
            className="text-red-600 font-semibold"
          />
        </div>
        {/* <p className="text-sm text-gray-500 mb-4">{application.properties.location}</p> */}
        <p className="text-sm text-gray-500 mb-4">
          {city}{stateName ? `, ${stateName}` : ''}{country ? ` ${country}` : ''}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {bathrooms}
          </span>
        </div>
        {sectionType === "continue" && (
          <div className="mb-4">
            <div className="text-sm text-gray-500">Completion status</div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-red-600 rounded-full"
                style={{
                  width: `${completedStep(
                    application?.completedSteps?.length
                  )}%`
                }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Last updated:{" "}
              {new Date(application?.updatedAt).toLocaleDateString()}
            </div>
          </div>
        )}
        <Link href={getNavigationUrl(application, sectionType)}>
          <Button className="w-full bg-red-600 hover:bg-red-700">
            {sectionType === "ongoing"
              ? `Resume application`
              : sectionType === "continue"
              ? "View application"
              : "View application"}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ApplicationCard;
