"use client";

import { useAllApplications } from "@/services/application/applicationFn";
import {
  ApplicationData,
  MainApplicationInterface
} from "@/types/applicationInterface";
import Link from "next/link";
import { ApplicationSection } from "./components/ApplicationSection";

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
// const ongoingApplicationsData: ApplicationData[] =
//   allApplicationsData?.ongoingApplications;
// const applicationInvitesData: ApplicationData[] =
//   allApplicationsData?.applicationInvites;
export default function ApplicationsPage() {


  const { data: allApplications, isFetching: allApplicationsFetch } =
    useAllApplications();

    // const filterApplicationsByStatus = (statuses: ApplicationStatus[]) => {
    //   return allApplications?.applications?.invites?.filter((app: ApplicationData) => 
    //     statuses.includes(app.response as ApplicationStatus)
    //   ) || [];
    // };
  console.log("allApplications is here",allApplications);
  const allApplicationsData: MainApplicationInterface =
    allApplications?.applications;

  const pendingApplicationsData: ApplicationData[] =
    allApplicationsData?.pendingApplications;

  const completedApplicationsData: ApplicationData[] =
    allApplicationsData?.completedApps;

  // const declinedApplicationsData: ApplicationData[] =
  //   allApplicationsData?.declinedApplications;

  // const makePaymentApplicationsData: ApplicationData[] =
  //   allApplicationsData?.makePaymentApplications;

  const submittedApplicationsData: ApplicationData[] =
    allApplicationsData?.submittedApplications;

    const applicationInvitesData: ApplicationData[] =
    allApplicationsData?.invites;

    // // Get applications for each section
    // const submittedApplications = filterApplicationsByStatus([
    //   ApplicationStatus.SUBMITTED
    // ]);
  
    // const completedApplications = filterApplicationsByStatus([
    //   ApplicationStatus.COMPLETED,
    //   ApplicationStatus.APPROVED,
    //   ApplicationStatus.AGREEMENTS_SIGNED
    // ]);
  
    // const declinedApplications = filterApplicationsByStatus([
    //   ApplicationStatus.DECLINED
    // ]);
  
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

        <h1 className="text-3xl font-bold mb-8">Applications</h1>

        <ApplicationSection
          title="Continue Applying"
          description="Complete your pending applications to take the next step toward securing your new home."
          data={pendingApplicationsData}
          isLoading={allApplicationsFetch}
          sectionType="ongoing"
          emptyMessage="You don't have any pending applications. Start browsing properties to begin your journey."
        />

        <ApplicationSection
          title="Submitted Applications"
          description="Track the status of your submitted applications and stay updated on their progress."
          data={submittedApplicationsData}
          isLoading={allApplicationsFetch}
          sectionType="submitted"
          emptyMessage="You haven't submitted any applications yet. Complete your pending applications to see them here."
        />

        <ApplicationSection
          title="Application Invites"
          description="Properties where you've been invited to apply based on your interest. Complete your application to secure your new home."
          data={applicationInvitesData}
          isLoading={allApplicationsFetch}
          sectionType="invite"
          emptyMessage="No application invites at the moment. Keep exploring properties to receive invites."
        />


        <ApplicationSection
          title="Completed Applications"
          description="Properties where you've completed your application. Keep exploring properties to receive invites."
          data={completedApplicationsData}
          isLoading={allApplicationsFetch}
          sectionType="completed"
          emptyMessage="No completed applications at the moment. Keep exploring properties to receive invites."
        />

        {/* <ApplicationSection
          title="Declined Applications"
          description="Properties where you've declined your application. Keep exploring properties to receive invites."
          data={declinedApplicationsData}
          isLoading={allApplicationsFetch}
          sectionType="declined"
          emptyMessage="No declined applications at the moment. Keep exploring properties to receive invites."
        /> */}

    
      </div>
    </div>
  );
}
