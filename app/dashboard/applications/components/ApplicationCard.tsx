import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ApplicationData } from "@/types/applicationInterface";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bed, Bath } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const getStatusBadgeColor = (status?: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "submitted":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
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
  property,
  sectionType
}: {
  property: ApplicationData & {
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
  // console.log(property);
  return (
    // NOTE: Property is the application object
    <Card className="overflow-hidden flex flex-col justify-between min-h-[430px]">
      <div className="relative h-48">
        <Image
          src={
            property?.properties?.images[0] ||
            "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg"
          }
          alt={property?.properties?.name}
          fill
          className="object-cover"
        />
        {property.status && (
          <Badge
            className={`absolute top-2 right-2 ${getStatusBadgeColor(
              property.status
            )}`}
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{property?.properties?.name}</h3>
          <span className="text-red-600 font-semibold">
            {formatPrice(Number(property?.properties?.rentalFee))}
          </span>
        </div>
        {/* <p className="text-sm text-gray-500 mb-4">{property.properties.location}</p> */}
        <p className="text-sm text-gray-500 mb-4">
          {property?.properties?.city}, {property?.properties?.country}{" "}
          {property?.properties?.zipcode}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property?.properties?.noBedRoom}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property?.properties?.noBathRoom}
          </span>
        </div>
        {sectionType === "continue" && (
          <div className="mb-4">
            <div className="text-sm text-gray-500">Completion status</div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-red-600 rounded-full"
                style={{
                  width: `${completedStep(property?.completedSteps?.length)}%`
                }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(property?.updatedAt).toLocaleDateString()}
            </div>
          </div>
        )}
        <Link
          href={
            sectionType === "ongoing"
              ? property?.status === "approved"
                ? `/dashboard/applications/${property?.id}/approved`
                : property?.status === "rejected"
                ? `/dashboard/applications/${property?.id}/rejected`
                : `/dashboard/applications/${property?.id}/success`
              : sectionType === "continue" || sectionType === "submitted"
              ? `/dashboard/applications/${property?.properties?.id}/progress?applicationId=${property?.id}`
              : `/dashboard/applications/${property?.properties?.id}/apply?applicationId=${property?.id}`
          }
        >
          <Button className="w-full bg-red-600 hover:bg-red-700">
            {sectionType === "ongoing"
              ? property?.status === "approved"
                ? "View approved"
                : property?.status === "rejected"
                ? "View rejected"
                : property?.status === "submitted"
                ? "View submitted"
                : "View application"
              : sectionType === "continue"
              ? "Resume application"
              : "View application"}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ApplicationCard;
