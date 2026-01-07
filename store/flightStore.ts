import { Database } from "@/utils/database";
import { LocationService } from "@/utils/location";
import { Storage } from "@/utils/storage";
import { Alert } from "react-native";
import { create } from "zustand";

const STORAGE_KEY = "flight_state";

interface FlightStateData {
  isFlying: boolean;
  takeoffTime: number | null;
  takeoffLat: number | null;
  takeoffLong: number | null;
  takeoffLocation: string | null;
  lastFlight: any | null; // Replace 'any' with proper type if possible, or keep loose for now to avoid circular deps
  stats: {
    today: number;
    month: number;
  };
}

interface FlightState extends FlightStateData {
  isLoading: boolean;
  loadingMessage: string | null;
  startFlight: () => Promise<void>;
  endFlight: (landingType?: "NORMAL" | "FORCED") => Promise<number | undefined>;
  discardFlight: () => Promise<void>;
  restoreState: () => Promise<void>;
  loadStats: () => Promise<void>;
}

export const useFlightStore = create<FlightState>((set, get) => ({
  isFlying: false,
  takeoffTime: null,
  takeoffLat: null,
  takeoffLong: null,
  takeoffLocation: null,
  lastFlight: null,
  stats: {
    today: 0,
    month: 0,
  },
  isLoading: true,
  loadingMessage: null,

  loadStats: async () => {
    try {
      const [lastFlight, stats] = await Promise.all([Database.getLastFlight(), Database.getFlightStats()]);
      set({ lastFlight, stats });
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  },

  startFlight: async () => {
    set({ isLoading: true, loadingMessage: "正在准备起飞..." });
    try {
      // 1. 请求权限并定位
      const hasPermission = await LocationService.requestPermissions();
      let location = null;
      if (hasPermission) {
        set({ loadingMessage: "正在获取当前位置..." });
        try {
          location = await LocationService.getCurrentLocation();
        } catch (err: any) {
          if (err.message === "LOCATION_TIMEOUT") {
            Alert.alert("定位超时", "获取位置时间过长，将以无位置模式继续记录。");
          }
        }
      }

      const now = Date.now();
      const newState: Partial<FlightStateData> = {
        isFlying: true,
        takeoffTime: now,
        takeoffLat: location?.latitude ?? null,
        takeoffLong: location?.longitude ?? null,
        takeoffLocation: location?.address ?? null,
      };

      // 2. 保存到 KV 并更新状态
      await Storage.set(STORAGE_KEY, newState);
      set({ ...newState, isLoading: false, loadingMessage: null });
    } catch (e) {
      console.error("Failed to start flight:", e);
      set({ isLoading: false, loadingMessage: null });
      Alert.alert("错误", "启动飞行记录失败");
    }
  },

  discardFlight: async () => {
    set({ isLoading: true, loadingMessage: "正在放弃记录..." });
    try {
      // 1. 清理 KV
      await Storage.remove(STORAGE_KEY);

      // 2. 更新状态
      set({
        isFlying: false,
        takeoffTime: null,
        takeoffLat: null,
        takeoffLong: null,
        takeoffLocation: null,
        isLoading: false,
        loadingMessage: null,
      });
    } catch (e) {
      console.error("Failed to discard flight:", e);
      set({ isLoading: false, loadingMessage: null });
    }
  },

  endFlight: async (landingType: "NORMAL" | "FORCED" = "NORMAL") => {
    const { isFlying, takeoffTime, takeoffLat, takeoffLong, takeoffLocation } = get();

    if (!isFlying || !takeoffTime) return;

    set({ isLoading: true, loadingMessage: "正在记录降落数据..." });

    try {
      // 1. 获取降落位置
      set({ loadingMessage: "正在获取当前位置..." });
      let location = null;
      try {
        location = await LocationService.getCurrentLocation();
      } catch (err: any) {
        if (err.message === "LOCATION_TIMEOUT") {
          Alert.alert("定位超时", "获取降落位置超时，将以无位置模式完成保存。");
        }
      }

      // 2. 保存到 SQLite
      set({ loadingMessage: "正在保存记录..." });
      const id = await Database.addTrack({
        takeoffTime: new Date(takeoffTime).toISOString(),
        landingTime: new Date().toISOString(),
        takeoffLat: takeoffLat,
        takeoffLong: takeoffLong,
        takeoffLocation: takeoffLocation,
        landingLat: location?.latitude ?? null,
        landingLong: location?.longitude ?? null,
        landingLocation: location?.address ?? null,
        landingType: landingType,
      });

      // 3. 清理 KV
      await Storage.remove(STORAGE_KEY);

      // 4. 更新状态 并 刷新统计
      await get().loadStats();

      set({
        isFlying: false,
        takeoffTime: null,
        takeoffLat: null,
        takeoffLong: null,
        takeoffLocation: null,
        isLoading: false,
        loadingMessage: null,
      });

      return id;
    } catch (error) {
      console.error("Failed to end flight:", error);
      set({ isLoading: false, loadingMessage: null });
      Alert.alert("错误", "保存飞行记录失败");
      return undefined;
    }
  },

  restoreState: async () => {
    try {
      // 先加载统计数据
      await get().loadStats();

      const saved = await Storage.get<FlightStateData>(STORAGE_KEY);
      if (saved && saved.isFlying && saved.takeoffTime) {
        set({
          isFlying: true,
          takeoffTime: saved.takeoffTime,
          takeoffLat: saved.takeoffLat ?? null,
          takeoffLong: saved.takeoffLong ?? null,
          takeoffLocation: saved.takeoffLocation ?? null,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error("Failed to restore flight state", e);
      set({ isLoading: false });
    }
  },
}));
