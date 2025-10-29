'use client'

import { IUser } from '@/types/types';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


/**
 * Zustand state for user information.
 */
interface UserState {
    user: IUser | null;
    hasHydrated: boolean;
}

/**
 * Zustand actions for user state management.
 */
interface UserActions {
    setUser: (user: IUser | null) => void;
    clearUser: () => void;
    setHasHydrated: (hasHydrated: boolean) => void;
}

/**
 * Zustand store type for user state and actions.
 */
type UserStore = UserState & UserActions;

const loadUserFromStorage = (): IUser | null => {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

export const userStore = create<UserStore>()(persist(
    (set) => ({
        user: null,
        hasHydrated: false,
        setUser: (user: IUser | null) => set({ user }),
        setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
        clearUser: () => {
            set({ user: null });
            if (typeof window !== 'undefined') {
                localStorage.removeItem("user");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            }
        },
    }),
    {
        name: 'user',
        // storage: createJSONStorage(() => localStorage), we dont need to pass this by defualt localstorage is used
        partialize: (state) => ({ user: state.user }),
        onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true);
        },
    }
)
);

/**
 * Hook to check if user is authenticated
 * @returns {boolean} authentication status
 */
export const useIsAuthenticated = (): boolean => {
    const user = userStore((state) => state.user);
    const hasHydrated = userStore((state) => state.hasHydrated);
    
    // Wait for hydration to complete
    if (!hasHydrated) return false;
    
    // Check both user in store and access_token in localStorage
    const hasUser = !!user;
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
    
    return hasUser || hasToken;
}

/**
 * Hook to log out the user and redirect to home.
 * @returns {() => void} logout function
 */
export const useLoggedOut = (): (() => void) => {
    const router = useRouter()
    const clear = userStore((state) => state.clearUser)

    const logout = () => {
        clear()
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token')
            router.push('/')
        }
    }

    return logout
}