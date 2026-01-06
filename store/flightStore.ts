import { Database } from "@/utils/database";
import { Storage } from "@/utils/storage";
import { Alert } from "react-native";
import { create } from "zustand";

const STORAGE_KEY = "flight_state";

interface FlightStateData {
  isFlying: boolean;
  takeoffTime: number | null;
}

interface FlightState extends FlightStateData {
  isLoading: boolean;
  startFlight: () => Promise<void>;
  endFlight: (landingType?: "NORMAL" | "FORCED") => Promise<void>;
  restoreState: () => Promise<void>;
}

export const useFlightStore = create<FlightState>((set, get) => ({
  isFlying: false,
  takeoffTime: null,
  isLoading: true,

  startFlight: async () => {
    const now = Date.now();
    const newState: FlightStateData = { isFlying: true, takeoffTime: now };

    // Optimistic update
    set(newState);

    try {
      await Storage.set(STORAGE_KEY, newState);
    } catch (e) {
      console.error("Failed to save flight state to KV", e);
    }
  },

  endFlight: async (landingType: "NORMAL" | "FORCED" = "NORMAL") => {
    const { isFlying, takeoffTime } = get();

    if (!isFlying || !takeoffTime) return;

    try {
      // 1. Save to SQLite
      await Database.addTrack({
        takeoffTime: new Date(takeoffTime).toISOString(),
        landingTime: new Date().toISOString(),
        landingType: landingType,
      });

      // 2. Clear from KV
      await Storage.remove(STORAGE_KEY);

      // 3. Update State
      set({ isFlying: false, takeoffTime: null });
    } catch (error) {
      console.error("Failed to end flight:", error);
      Alert.alert("错误", "保存飞行记录失败");
    }
  },

  restoreState: async () => {
    try {
      const saved = await Storage.get<FlightStateData>(STORAGE_KEY);
      if (saved && saved.isFlying && saved.takeoffTime) {
        set({ isFlying: true, takeoffTime: saved.takeoffTime, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error("Failed to restore flight state", e);
      set({ isLoading: false });
    }
  },
}));
