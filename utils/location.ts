import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Geolocation, init, setLocatingWithReGeocode, setNeedAddress } from "react-native-amap-geolocation";

const AMAP_KEY_IOS = "cf911f793d24cec90b58dc21357b4305";
const AMAP_KEY_ANDROID = "749992be386d2122a71b50c5a06cd42d";

export const LocationService = {
  isInitialized: false,

  async init() {
    if (this.isInitialized) return;
    await init({
      ios: AMAP_KEY_IOS,
      android: AMAP_KEY_ANDROID,
    });

    if (Platform.OS === "android") {
      setNeedAddress(true); // Android 开启逆地理编码
    } else if (Platform.OS === "ios") {
      setLocatingWithReGeocode(true); // iOS 开启逆地理编码
    }

    this.isInitialized = true;
  },

  /**
   * 申请定位权限
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]);

        if (granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED && granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert("权限要求", "为了记录起飞和降落位置，请授予应用定位权限。您可以在设置中手动开启。", [{ text: "确定" }]);
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    // iOS 权限会在调用获取位置时自动触发申请
    return true;
  },

  /**
   * 获取当前位置（含 5s 超时处理）
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number; address?: string } | null> {
    await this.init();

    return new Promise((resolve) => {
      // 5s 超时计时器
      const timer = setTimeout(() => {
        console.warn("Location request timed out after 5s");
        resolve(null);
      }, 5000);

      Geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timer);
          let address = "";
          if (position.location) {
            const { country, province, city, district, street } = position.location as any;
            const addressObj = {
              country,
              province,
              city,
              district,
              street,
            };
            address = JSON.stringify(addressObj);
          }

          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: address || undefined,
          });
        },
        (error) => {
          clearTimeout(timer);
          console.error("Error getting location:", error);
          resolve(null);
        }
      );
    });
  },
};

export const getCityName = (locationStr: string | null) => {
  if (!locationStr) return "未知";
  try {
    const addr = JSON.parse(locationStr);
    return addr.city || addr.district || "未知位置";
  } catch (e) {
    return "未知";
  }
};

export const formatLocation = (locationStr: string | null) => {
  if (!locationStr) return "未知位置";
  try {
    const addr = JSON.parse(locationStr);
    if (addr && (addr.city || addr.district || addr.street)) {
      return `${addr.city || ""}${addr.district || ""}${addr.street || ""}`.trim();
    }
    return locationStr;
  } catch (e) {
    return locationStr;
  }
};

export const AMAP_WEB_KEY = "4c627a9b25337a2bde8e6e57203b6d7c"; // 请在此处填写高德地图Web服务Key

export const reverseGeocode = async (latitude: number, longitude: number) => {
  if (!AMAP_WEB_KEY) {
    console.warn("AMAP_WEB_KEY is empty");
    return null;
  }
  try {
    const response = await fetch(`https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${AMAP_WEB_KEY}&radius=1000&extensions=all`);
    const data = await response.json();
    if (data.status === "1" && data.regeocode) {
      const component = data.regeocode.addressComponent;

      // 处理直辖市 city 为空的情况 (例如上海市，city可能为空数组或空字符串，此时使用province)
      let city = component.city;
      if (!city || (Array.isArray(city) && city.length === 0)) {
        city = component.province;
      }

      return JSON.stringify({
        country: component.country,
        province: component.province,
        city: city,
        district: component.district,
        street: component.streetNumber?.street || "",
        formattedAddress: data.regeocode.formatted_address,
      });
    }
  } catch (e) {
    console.error("Reverse geocoding failed:", e);
  }
  return null;
};
