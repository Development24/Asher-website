import { ApplicationData } from "@/types/applicationInterface";
import { create } from "zustand";

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

export const useReuseAbleStore = create<State & Actions>((set) => ({
    applicationId: "",
    propertyId: "",
    applicationInvitedId: "",
    applicationData: {} as ApplicationData,
    setApplicationId: (applicationId) => set({ applicationId }),
    setApplicationInvitedId: (applicationInvitedId) => set({ applicationInvitedId }),
    setPropertyId: (propertyId) => set({ propertyId }),
    setApplicationData: (applicationData) => set({ applicationData }),
    reset: () => set({ applicationId: "", propertyId: "", applicationInvitedId: "", applicationData: {} as ApplicationData }),
    
}));
