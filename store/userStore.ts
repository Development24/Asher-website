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
}

/**
 * Zustand actions for user state management.
 */
interface UserActions {
    setUser: (user: IUser | null) => void;
    clearUser: () => void;
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
        user: loadUserFromStorage(),
        setUser: (user: IUser | null) => set({ user }),
        clearUser: () => {
            set({ user: null });
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        },
    }),
    {
        name: 'user',
        // storage: createJSONStorage(() => localStorage), we dont need to pass this by defualt localstorage is used
        partialize: (state) => ({ user: state.user }),
    }
)
);

/**
 * Hook to log out the user and redirect to home.
 * @returns {() => void} logout function
 */
export const useLoggedOut = (): (() => void) => {
    const router = useRouter()
    const clear = userStore((state) => state.clearUser)

    const logout = () => {
        clear()
        localStorage.removeItem('access_token')
        router.push('/')
    }

    return logout
}