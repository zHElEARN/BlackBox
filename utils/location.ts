import * as Location from "expo-location";
import { Alert } from "react-native";

export const LocationService = {
  /**
   * 申请定位权限
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限要求", "为了记录起飞和降落位置，请授予应用定位权限。您可以在设置中手动开启。", [{ text: "确定" }]);
      return false;
    }
    return true;
  },

  /**
   * 获取当前位置（含 5s 超时处理）
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    const timeoutPromise = new Promise<null>((_, reject) => setTimeout(() => reject(new Error("LOCATION_TIMEOUT")), 5000));

    try {
      // 检查权限
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        return null;
      }

      // 使用 Promise.race 实现超时控制
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const location = (await Promise.race([locationPromise, timeoutPromise])) as Location.LocationObject;

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error: any) {
      if (error.message === "LOCATION_TIMEOUT") {
        console.warn("Location request timed out after 5s");
        throw error; // 向上层抛出超时错误
      }
      console.error("Error getting location:", error);
      return null;
    }
  },
};
