import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ApplicationData } from "@/types/applicationInterface";
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bed, Bath } from "lucide-react";
import { formatPrice } from "@/lib/utils";
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
    switch (application.status) {
      case ApplicationStatus.SUBMITTED:
        return `/dashboard/applications/${application.id}/submitted?applicationId=${application.id}`;
      case ApplicationStatus.COMPLETED:
      case ApplicationStatus.APPROVED:
        return `/dashboard/applications/${application.id}/completed?applicationId=${application.id}`;
      case ApplicationStatus.DECLINED:
        return `/dashboard/applications/${application.id}/declined?applicationId=${application.id}`;
      case ApplicationStatus.AGREEMENTS:
      case ApplicationStatus.AGREEMENTS_SIGNED:
        return `/dashboard/applications/${application.id}/agreements?applicationId=${application.id}`;
      case ApplicationStatus.PENDING:
        if (sectionType === "ongoing") {
          return `/dashboard/applications/${application?.properties?.id}/progress?applicationId=${application?.id}`;
        }
      default:
        return `/dashboard/applications/${
          application.properties?.id
        }/apply?applicationInviteId=${
          application.applicationInviteId || application.id
        }`;
    }
  };

  return (
    // NOTE: application is the application object
    <Card className="overflow-hidden flex flex-col justify-between min-h-[430px]">
      <div className="relative h-48">
        <Image
          src={
            displayImages(application?.properties?.images)?.[0] ||
            "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg"
          }
          alt={application?.properties?.name}
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
          <h3 className="font-semibold">{application?.properties?.name}</h3>
          <span className="text-red-600 font-semibold">
            {formatPrice(Number(application?.properties?.price))}
          </span>
        </div>
        {/* <p className="text-sm text-gray-500 mb-4">{application.properties.location}</p> */}
        <p className="text-sm text-gray-500 mb-4">
          {application?.properties?.city}, {application?.properties?.state?.name}{" "}
          {application?.properties?.country}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {application?.properties?.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {application?.properties?.bathrooms}
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
