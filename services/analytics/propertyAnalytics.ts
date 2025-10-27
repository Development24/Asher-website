import { api } from '../api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface PropertyAnalyticsData {
  propertyId: string;
  propertyName: string;
  analytics: {
    totalViews: number;
    totalClicks: number;
    totalEngagement: number;
    engagementRate: number;
    totalTimeSpent: number;
    averageTimeSpent: number;
    totalVisits: number;
    trafficData: {
      dailyViews: Array<{
        date: string;
        views: number;
        unique_visitors: number;
      }>;
      trafficSources: {
        direct: number;
        search: number;
        social: number;
        referral: number;
      };
      topReferrers: Array<{
        source: string;
        visitors: number;
      }>;
    };
    recentActivity: Array<{
      id: string;
      type: string;
      event: string;
      user: string;
      timestamp: string;
      status?: string;
    }>;
    period: string;
    lastUpdated: string;
  };
}

// Track property view
export const trackPropertyView = async (propertyId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    await fetch(`${API_BASE_URL}/api/property/view/${propertyId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to track property view:', error);
    // Don't throw error to avoid breaking the user experience
  }
};

// Track property enquiry
export const trackPropertyEnquiry = async (propertyId: string, enquiryData: any): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    await fetch(`${API_BASE_URL}/api/property/enquire`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...enquiryData,
        propertyId
      }),
    });
  } catch (error) {
    console.error('Failed to track property enquiry:', error);
  }
};

// Track property like
export const trackPropertyLike = async (propertyId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    await fetch(`${API_BASE_URL}/api/property/likes/${propertyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to track property like:', error);
  }
};

// Get property listing analytics (for landlord dashboard)
export const getPropertyListingAnalytics = async (
  propertyId: string, 
  period: string = '30days'
): Promise<PropertyAnalyticsData> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/landlord/analytics/property-listing/${propertyId}?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch property listing analytics');
  }

  const data = await response.json();
  return data.data;
};
