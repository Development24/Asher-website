import { ApplicationData } from "@/types/applicationInterface";
import { create } from "zustand";
import { persist } from 'zustand/middleware'

interface State {
    applicationId: string;
    applicationInvitedId: string;
    propertyId: string;
    applicationData: ApplicationData;
}

interface Actions {
    setApplicationId: (applicationId: string) => void;
    setApplicationInvitedId: (applicationInvitedId: string) => void;
    setPropertyId: (propertyId: string) => void;
    setApplicationData: (applicationData: ApplicationData) => void;
}

export const useReuseAbleStore = create(
    persist(
        (set) => ({
            applicationId: "",
            propertyId: "",
            applicationInvitedId: "",
            applicationData: {} as ApplicationData,
            setApplicationId: (applicationId: string) => set({ applicationId }),
            setApplicationInvitedId: (applicationInvitedId: string) => set({ applicationInvitedId }),
            setPropertyId: (propertyId: string) => set({ propertyId }),
            setApplicationData: (applicationData: ApplicationData) => set({ applicationData }),
            reset: () => set({ applicationId: "", propertyId: "", applicationInvitedId: "", applicationData: {} as ApplicationData }),
        }),
        {
            name: 'application-storage',
        }
    )
);
