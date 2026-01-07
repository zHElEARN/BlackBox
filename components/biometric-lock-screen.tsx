import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";

export default function BiometricLockScreen() {
  const { isLocked, setLocked, isAuthenticating, setIsAuthenticating } = useAuthStore();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  useEffect(() => {
    if (isLocked) {
      authenticate();
    }
  }, [isLocked]);

  const authenticate = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // If biometrics not available but locked, we might want to fallback or just unlock
        // but for now let's assume if it was enabled, it worked before.
        // In a real app, you might fallback to passcode.
        console.warn("Biometrics/Passcode not available or not enrolled, but lock screen is showing.");
        // alert("Only biometric/passcode is supported for now.");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "验证身份以解锁",
        cancelLabel: "取消",
        disableDeviceFallback: false,
      });

      if (result.success) {
        useAuthStore.getState().setLastSuccessTime(Date.now());
        setLocked(false);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      // Delay resetting to prevent race condition with AppState change
      setTimeout(() => setIsAuthenticating(false), 1000);
    }
  };

  if (!isLocked) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.tint + "15" }]}>
          <MaterialCommunityIcons name="shield-lock" size={64} color={theme.tint} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>应用已锁定</Text>
        <Text style={[styles.subtitle, { color: theme.icon }]}>请验证身份以继续使用</Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint, marginTop: 40 }]} onPress={authenticate} activeOpacity={0.8}>
          <MaterialCommunityIcons name="shield-check" size={24} color={theme.background} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, { color: theme.background }]}>点击进行验证</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Ensure it covers everything
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    minWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
