/**
 * Application Normalizer
 * Normalizes application data by fetching and merging the actual listing
 * 
 * This ensures we work with the actual listed item (room/unit/property)
 * rather than manually extracting data from the property object
 */

import { getPropertyByIdForListingId, getPropertyById } from '@/services/property/property';
import { Listing } from '@/services/property/types';

export interface NormalizedApplication {
  // Application metadata
  id: string; // Original application ID (preserved)
  applicationId: string; // Alias for consistency
  applicationInviteId: string | null; // Preserved from original
  propertiesId: string | null; // Preserved from original
  status: string;
  completedSteps: string[];
  lastStep: string;
  stepCompleted: number;
  invited: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  
  // User/applicant info
  user: {
    id: string;
    email: string;
    profile: {
      id: string;
      fullname: string;
      firstName: string;
      lastName: string;
      middleName: string | null;
      profileUrl: string | null;
      phoneNumber: string | null;
    };
  };
  
  // Personal details
  personalDetails: {
    id: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob: string | Date;
    maritalStatus: string;
    nationality: string;
  } | null;
  
  // Application invite info
  applicationInvite: {
    id: string;
    scheduleDate: string | Date | null;
    response: string;
    applicationFee: string;
    propertyListingId: string | null;
  } | null;
  
  // The actual listing (normalized)
  listing: Listing | null;
  
  // Fallback property data (if listing fetch fails)
  property: any | null;
}

export class ApplicationNormalizer {
  /**
   * Normalize a single application
   * Fetches the actual listing using propertyListingId from applicationInvite
   * 
   * @param application - Raw application data from API
   * @returns Normalized application with listing
   */
  static async normalize(application: any): Promise<NormalizedApplication> {
    // Try multiple paths to find propertyListingId
    const propertyListingId = 
      application?.applicationInvites?.propertyListingId || 
      application?.applicationInvite?.propertyListingId ||
      application?.enquires?.propertyListingId ||
      application?.enquiry?.propertyListingId ||
      null;
    // Preserve original propertiesId - this is critical for navigation
    const propertiesId = application?.propertiesId || application?.properties?.id;
    const propertyId = propertiesId; // Use propertiesId as propertyId
    
    let listing: Listing | null = null;
    let property: any = application?.properties || null;
    
    // Try to fetch the actual listing if propertyListingId exists
    if (propertyListingId) {
      try {
        const listingResponse = await getPropertyByIdForListingId(propertyListingId);
        if (listingResponse?.property) {
          listing = listingResponse.property as Listing;
          // Use normalized property from listing if available
          if (listing?.property) {
            property = listing.property;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch listing for application:', error);
        // Try to fetch property by ID to get full details including specification
        if (propertyId) {
          try {
            const propertyResponse = await getPropertyById(propertyId);
            if (propertyResponse?.property) {
              property = propertyResponse.property;
            }
          } catch (propError) {
            console.warn('Failed to fetch property details:', propError);
          }
        }
      }
    } else if (propertyId) {
      // If no propertyListingId, fetch property by ID to get full details
      try {
        const propertyResponse = await getPropertyById(propertyId);
        if (propertyResponse?.property) {
          property = propertyResponse.property;
        }
      } catch (error) {
        console.warn('Failed to fetch property details:', error);
      }
    }
    
    return {
      // Preserve original application ID fields (critical for navigation)
      id: application.id, // Original application ID
      applicationId: application.id, // Alias for consistency
      applicationInviteId: application.applicationInviteId || null, // Preserve invite ID
      propertiesId: propertiesId || null, // Preserve original propertiesId
      status: application.status,
      completedSteps: application.completedSteps || [],
      lastStep: application.lastStep || '',
      stepCompleted: application.stepCompleted || 0,
      invited: application.invited || 'NO',
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      user: {
        id: application.user?.id || application.userId || '',
        email: application.user?.email || '',
        profile: {
          id: application.user?.profile?.id || '',
          fullname: application.user?.profile?.fullname || '',
          firstName: application.user?.profile?.firstName || '',
          lastName: application.user?.profile?.lastName || '',
          middleName: application.user?.profile?.middleName || null,
          profileUrl: application.user?.profile?.profileUrl || null,
          phoneNumber: application.user?.profile?.phoneNumber || null,
        },
      },
      personalDetails: application.personalDetails ? {
        id: application.personalDetails.id,
        title: application.personalDetails.title || '',
        firstName: application.personalDetails.firstName || '',
        middleName: application.personalDetails.middleName || '',
        lastName: application.personalDetails.lastName || '',
        email: application.personalDetails.email || '',
        phoneNumber: application.personalDetails.phoneNumber || '',
        dob: application.personalDetails.dob,
        maritalStatus: application.personalDetails.maritalStatus || '',
        nationality: application.personalDetails.nationality || '',
      } : null,
      applicationInvite: (application.applicationInvites || application.applicationInvite) ? {
        id: (application.applicationInvites || application.applicationInvite)?.id || '',
        scheduleDate: (application.applicationInvites || application.applicationInvite)?.scheduleDate || null,
        response: (application.applicationInvites || application.applicationInvite)?.response || '',
        applicationFee: (application.applicationInvites || application.applicationInvite)?.applicationFee || 'NO',
        propertyListingId: propertyListingId,
      } : null,
      listing,
      property,
    };
  }
  
  /**
   * Normalize multiple applications
   * 
   * @param applications - Array of raw application data
   * @returns Array of normalized applications
   */
  static async normalizeMany(applications: any[]): Promise<NormalizedApplication[]> {
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    const normalized: NormalizedApplication[] = [];
    
    for (let i = 0; i < applications.length; i += batchSize) {
      const batch = applications.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(application => this.normalize(application))
      );
      normalized.push(...batchResults);
    }
    
    return normalized;
  }
}
