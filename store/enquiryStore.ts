import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EnquiryState {
  propertyId: string;
  hasEnquired: boolean;
  hasChatted: boolean;
  enquiryDate?: string;
  lastChatDate?: string;
}

interface EnquiryStore {
  enquiries: Record<string, EnquiryState>;
  
  // Actions
  markAsEnquired: (propertyId: string) => void;
  markAsChatted: (propertyId: string) => void;
  hasEnquired: (propertyId: string) => boolean;
  hasChatted: (propertyId: string) => boolean;
  getEnquiryState: (propertyId: string) => EnquiryState | null;
  resetEnquiry: (propertyId: string) => void;
  resetAllEnquiries: () => void;
}

export const useEnquiryStore = create<EnquiryStore>()(
  persist(
    (set, get) => ({
      enquiries: {},

      markAsEnquired: (propertyId: string) => {
        set((state) => ({
          enquiries: {
            ...state.enquiries,
            [propertyId]: {
              propertyId,
              hasEnquired: true,
              hasChatted: state.enquiries[propertyId]?.hasChatted || false,
              enquiryDate: new Date().toISOString(),
              lastChatDate: state.enquiries[propertyId]?.lastChatDate,
            },
          },
        }));
      },

      markAsChatted: (propertyId: string) => {
        set((state) => ({
          enquiries: {
            ...state.enquiries,
            [propertyId]: {
              propertyId,
              hasEnquired: state.enquiries[propertyId]?.hasEnquired || true,
              hasChatted: true,
              enquiryDate: state.enquiries[propertyId]?.enquiryDate,
              lastChatDate: new Date().toISOString(),
            },
          },
        }));
      },

      hasEnquired: (propertyId: string) => {
        return get().enquiries[propertyId]?.hasEnquired || false;
      },

      hasChatted: (propertyId: string) => {
        return get().enquiries[propertyId]?.hasChatted || false;
      },

      getEnquiryState: (propertyId: string) => {
        return get().enquiries[propertyId] || null;
      },

      resetEnquiry: (propertyId: string) => {
        set((state) => {
          const newEnquiries = { ...state.enquiries };
          delete newEnquiries[propertyId];
          return { enquiries: newEnquiries };
        });
      },

      resetAllEnquiries: () => {
        set({ enquiries: {} });
      },
    }),
    {
      name: 'enquiry-store',
      partialize: (state) => ({ enquiries: state.enquiries }),
    }
  )
); 