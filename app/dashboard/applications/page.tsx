"use client";

import { useState } from "react";
import { useAllApplications } from "@/services/application/applicationFn";
import {
  ApplicationData,
  MainApplicationInterface
} from "@/types/applicationInterface";
import Link from "next/link";
import { ApplicationSection } from "./components/ApplicationSection";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
  specs: {
    beds: number;
    baths: number;
  };
  status?: "approved" | "submitted" | "rejected";
}

interface SavedDraft {
  id: number;
  propertyId: number;
  lastUpdated: string;
  completionStatus: number;
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
  AGREEMENTS = 'AGREEMENTS',
  AGREEMENTS_SIGNED = 'AGREEMENTS_SIGNED',
  LANDLORD_REFERENCE = 'LANDLORD_REFERENCE',
  GUARANTOR_REFERENCE = 'GUARANTOR_REFERENCE',
  EMPLOYEE_REFERENCE = 'EMPLOYEE_REFERENCE',
  APPROVED = 'APPROVED',
  APPLICATION_FEE_PAID = 'APPLICATION_FEE_PAID',
  MAKEPAYMENT = 'MAKEPAYMENT',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_PARTIALLY_COMPLETED = 'PAYMENT_PARTIALLY_COMPLETED',
  ACCEPTED = 'ACCEPTED',
  TENANT_CREATED = 'TENANT_CREATED',
  IN_PROGRESS='IN_PROGRESS'
}

type SectionType = 'invites' | 'ongoing' | 'submitted' | 'completed';

export default function ApplicationsPage() {
  const [expandedSections, setExpandedSections] = useState<Set<SectionType>>(new Set(['invites']));

  const { data: allApplications, isFetching: allApplicationsFetch } =
    useAllApplications();

  const allApplicationsData = allApplications?.applications;

  const pendingApplicationsData: ApplicationData[] =
    (allApplicationsData as any)?.pendingApplications || [];

  const completedApplicationsData: ApplicationData[] =
    (allApplicationsData as any)?.completedApps || [];

  const submittedApplicationsData: ApplicationData[] =
    (allApplicationsData as any)?.submittedApplications || [];

  const applicationInvitesData: ApplicationData[] =
    (allApplicationsData as any)?.invites || [];

  const toggleSection = (section: SectionType) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const SectionHeader = ({ 
    title, 
    count, 
    section, 
    isExpanded 
  }: { 
    title: string; 
    count: number; 
    section: SectionType; 
    isExpanded: boolean;
  }) => (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-6"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>
      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </div>
  );

  return (
    <div className="layout">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Applications</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Applications</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/applications/cancelled">
              View Cancelled
            </Link>
          </Button>
        </div>

        <SectionHeader
          title="Application Invites"
          count={applicationInvitesData?.length || 0}
          section="invites"
          isExpanded={expandedSections.has('invites')}
        />
        {expandedSections.has('invites') && (
          <ApplicationSection
            title="Application Invites"
            description="Properties where you've been invited to apply based on your interest. Complete your application to secure your new home."
            data={applicationInvitesData}
            isLoading={allApplicationsFetch}
            sectionType="invite"
            emptyMessage="No application invites at the moment. Keep exploring properties to receive invites."
          />
        )}

        <SectionHeader
          title="Continue Applying"
          count={pendingApplicationsData?.length || 0}
          section="ongoing"
          isExpanded={expandedSections.has('ongoing')}
        />
        {expandedSections.has('ongoing') && (
          <ApplicationSection
            title="Continue Applying"
            description="Complete your pending applications to take the next step toward securing your new home."
            data={pendingApplicationsData}
            isLoading={allApplicationsFetch}
            sectionType="ongoing"
            emptyMessage="You don't have any pending applications. Start browsing properties to begin your journey."
          />
        )}

        <SectionHeader
          title="Submitted Applications"
          count={submittedApplicationsData?.length || 0}
          section="submitted"
          isExpanded={expandedSections.has('submitted')}
        />
        {expandedSections.has('submitted') && (
          <ApplicationSection
            title="Submitted Applications"
            description="Track the status of your submitted applications and stay updated on their progress."
            data={submittedApplicationsData}
            isLoading={allApplicationsFetch}
            sectionType="submitted"
            emptyMessage="You haven't submitted any applications yet. Complete your pending applications to see them here."
          />
        )}

        <SectionHeader
          title="Completed Applications"
          count={completedApplicationsData?.length || 0}
          section="completed"
          isExpanded={expandedSections.has('completed')}
        />
        {expandedSections.has('completed') && (
          <ApplicationSection
            title="Completed Applications"
            description="Properties where you've completed your application. Keep exploring properties to receive invites."
            data={completedApplicationsData}
            isLoading={allApplicationsFetch}
            sectionType="completed"
            emptyMessage="No completed applications at the moment. Keep exploring properties to receive invites."
          />
        )}
      </div>
    </div>
  );
}
