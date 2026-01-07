import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isBiometricEnabled: boolean;
  isLocked: boolean;
  isAuthenticating: boolean;
  lastSuccessTime: number;
  setBiometricEnabled: (enabled: boolean) => void;
  setLocked: (locked: boolean) => void;
  setIsAuthenticating: (authenticating: boolean) => void;
  setLastSuccessTime: (time: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isBiometricEnabled: false,
      isLocked: false,
      isAuthenticating: false,
      lastSuccessTime: 0,
      setBiometricEnabled: (enabled) => set({ isBiometricEnabled: enabled }),
      setLocked: (locked) => set({ isLocked: locked }),
      setIsAuthenticating: (authenticating) => set({ isAuthenticating: authenticating }),
      setLastSuccessTime: (time) => set({ lastSuccessTime: time }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isBiometricEnabled: state.isBiometricEnabled }), // Only persist configuration
    }
  )
);
