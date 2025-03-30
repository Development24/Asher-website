import { create } from "zustand";

interface AuthRedirectStore {
    redirectUrl: string | null;
    setRedirectUrl: (url: string|null) => void;
}

export const useAuthRedirectStore = create<AuthRedirectStore>((set) => ({
    redirectUrl: null,
    setRedirectUrl: (url) => set({ redirectUrl: url })
}))