"use client";

import { useAllApplications } from "@/services/application/applicationFn";
import {
  ApplicationData,
  MainApplicationInterface
} from "@/types/applicationInterface";
import Link from "next/link";
import { ApplicationSection } from "../components/ApplicationSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, XCircle } from "lucide-react";

export default function CancelledApplicationsPage() {
  const { data: allApplications, isFetching: allApplicationsFetch } =
    useAllApplications();

  const allApplicationsData = allApplications?.applications;

  const declinedApplicationsData: ApplicationData[] =
    (allApplicationsData as any)?.declinedApplications || [];

  const cancelledApplicationsData: ApplicationData[] =
    (allApplicationsData as any)?.cancelledApplications || [];

  const allCancelledApplications = [...declinedApplicationsData, ...cancelledApplicationsData];

  return (
    <div className="layout">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/dashboard/applications" className="text-gray-600 hover:text-gray-900">
            Applications
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Cancelled</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Cancelled Applications</h1>
        </div>

        {allCancelledApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
              <XCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Cancelled Applications</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any cancelled or rejected applications at the moment.
            </p>
            <Button asChild>
              <Link href="/dashboard/applications">View All Applications</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {declinedApplicationsData.length > 0 && (
              <ApplicationSection
                title="Rejected Applications"
                description="Applications that were rejected by the landlord or property manager."
                data={declinedApplicationsData}
                isLoading={allApplicationsFetch}
                sectionType="declined"
                emptyMessage="No rejected applications."
              />
            )}

            {cancelledApplicationsData.length > 0 && (
              <ApplicationSection
                title="Cancelled Applications"
                description="Applications that you cancelled or were cancelled by the system."
                data={cancelledApplicationsData}
                isLoading={allApplicationsFetch}
                sectionType="declined"
                emptyMessage="No cancelled applications."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
} 