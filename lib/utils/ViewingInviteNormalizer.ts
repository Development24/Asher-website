/**
 * Viewing Invite Normalizer
 * Normalizes viewing invite data by using backend-normalized listing or fetching if needed
 * 
 * The backend now returns normalized data with `listing` object, so we use that if available.
 * This ensures we work with the actual listed item (room/unit/property)
 * rather than manually extracting data from the property object
 */

import { getPropertyByIdForListingId, getPropertyById } from '@/services/property/property';
import { Listing } from '@/services/property/types';

export interface NormalizedViewingInvite {
  // Invite metadata
  inviteId: string;
  scheduleDate: string | Date | null;
  reScheduleDate: string | Date | null;
  response: string;
  responseStepsCompleted: string[];
  applicationFee: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  
  // User who was invited
  userInvited: {
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
  
  // Enquiry info
  enquiry: {
    id: string;
    type: string;
    status: string;
    events: string | null;
    createdAt: string | Date;
    propertyListingId: string | null;
  };
  
  // The actual listing (normalized) - from backend if available
  listing: Listing | null;
  
  // Fallback property data (if listing fetch fails)
  property: any | null;
}

export class ViewingInviteNormalizer {
  /**
   * Normalize a single viewing invite
   * Uses backend-normalized listing if available, otherwise fetches it
   * 
   * @param invite - Raw invite data from API (may already have normalized `listing` from backend)
   * @returns Normalized viewing invite with listing
   */
  static async normalize(invite: any): Promise<NormalizedViewingInvite> {
    // Backend now returns normalized data with `listing` object - use it if available
    let listing: Listing | null = invite?.listing || null;
    let property: any = invite?.properties || invite?.property || null;
    
    // Extract propertyListingId for enquiry object (always needed)
    const propertyListingId = invite?.enquires?.propertyListingId || invite?.enquiry?.propertyListingId || invite?.propertyListingId || null;
    
    // If backend didn't provide listing, try to fetch it
    if (!listing) {
      const propertyId = invite?.propertiesId || invite?.properties?.id;
      
      // Try to fetch the actual listing if propertyListingId exists
      if (propertyListingId) {
        try {
          const listingResponse = await getPropertyByIdForListingId(propertyListingId);
          if (listingResponse?.property) {
            listing = listingResponse.property as any;
            // Use normalized property from listing if available
            if (listing?.property) {
              property = listing.property;
            }
          }
        } catch (error) {
          console.warn('Failed to fetch listing for viewing invite:', error);
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
    } else {
      // Backend provided listing - use its property data if available
      if (listing?.property) {
        property = listing.property;
      }
    }
    
    return {
      inviteId: invite.id,
      scheduleDate: invite.scheduleDate,
      reScheduleDate: invite.reScheduleDate,
      response: invite.response,
      responseStepsCompleted: invite.responseStepsCompleted || [],
      applicationFee: invite.applicationFee,
      createdAt: invite.createdAt,
      updatedAt: invite.updatedAt,
      userInvited: {
        id: invite.userInvited?.id || invite.userInvitedId,
        email: invite.userInvited?.email || '',
        profile: {
          id: invite.userInvited?.profile?.id || '',
          fullname: invite.userInvited?.profile?.fullname || '',
          firstName: invite.userInvited?.profile?.firstName || '',
          lastName: invite.userInvited?.profile?.lastName || '',
          middleName: invite.userInvited?.profile?.middleName || null,
          profileUrl: invite.userInvited?.profile?.profileUrl || null,
          phoneNumber: invite.userInvited?.profile?.phoneNumber || null,
        },
      },
      enquiry: {
        id: invite.enquires?.id || invite.enquiryId || '',
        type: invite.enquires?.type || '',
        status: invite.enquires?.status || '',
        events: invite.enquires?.events || null,
        createdAt: invite.enquires?.createdAt || invite.createdAt,
        propertyListingId: propertyListingId,
      },
      listing,
      property,
    };
  }
  
  /**
   * Normalize multiple viewing invites
   * 
   * @param invites - Array of raw invite data (may already have normalized `listing` from backend)
   * @returns Array of normalized viewing invites
   */
  static async normalizeMany(invites: any[]): Promise<NormalizedViewingInvite[]> {
    if (!invites || invites.length === 0) {
      return [];
    }
    
    // Process in batches to avoid overwhelming the API
    // Only fetch if backend didn't provide listing
    const batchSize = 5;
    const normalized: NormalizedViewingInvite[] = [];
    
    for (let i = 0; i < invites.length; i += batchSize) {
      const batch = invites.slice(i, i + batchSize);
      try {
        const batchResults = await Promise.all(
          batch.map(invite => this.normalize(invite))
        );
        normalized.push(...batchResults);
      } catch (error) {
        console.error('Error normalizing batch of invites:', error);
        // If normalization fails, return original invites with minimal processing
        batch.forEach(invite => {
          normalized.push({
            inviteId: invite.id,
            scheduleDate: invite.scheduleDate,
            reScheduleDate: invite.reScheduleDate,
            response: invite.response,
            responseStepsCompleted: invite.responseStepsCompleted || [],
            applicationFee: invite.applicationFee,
            createdAt: invite.createdAt,
            updatedAt: invite.updatedAt,
            userInvited: {
              id: invite.userInvited?.id || invite.userInvitedId,
              email: invite.userInvited?.email || '',
              profile: {
                id: invite.userInvited?.profile?.id || '',
                fullname: invite.userInvited?.profile?.fullname || '',
                firstName: invite.userInvited?.profile?.firstName || '',
                lastName: invite.userInvited?.profile?.lastName || '',
                middleName: invite.userInvited?.profile?.middleName || null,
                profileUrl: invite.userInvited?.profile?.profileUrl || null,
                phoneNumber: invite.userInvited?.profile?.phoneNumber || null,
              },
            },
            enquiry: {
              id: invite.enquires?.id || invite.enquiryId || '',
              type: invite.enquires?.type || '',
              status: invite.enquires?.status || '',
              events: invite.enquires?.events || null,
              createdAt: invite.enquires?.createdAt || invite.createdAt,
              propertyListingId: invite?.enquires?.propertyListingId || invite?.enquiry?.propertyListingId || invite?.propertyListingId || null,
            },
            listing: invite.listing || null,
            property: invite.properties || invite.property || null,
          });
        });
      }
    }
    
    return normalized;
  }
}
