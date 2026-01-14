import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import "react-native-reanimated";

import BiometricLockScreen from "@/components/biometric-lock-screen";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";
import { useFlightStore } from "@/store/flightStore";
import { Database } from "@/utils/database";
import { Storage } from "@/utils/storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const [isReady, setIsReady] = useState(false);

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  // 自定义的主题对象，确保背景色与应用设计高度一致，防止闪白
  const navigationTheme = useMemo(() => {
    const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: theme.background,
        card: theme.card,
        text: theme.text,
      },
    };
  }, [colorScheme, theme]);

  useEffect(() => {
    async function prepare() {
      try {
        await Database.init();
        await useFlightStore.getState().restoreState();

        // Check lock state on launch
        const authState = useAuthStore.getState();
        if (authState.isBiometricEnabled) {
          authState.setLocked(true);
        }

        const hasAgreed = await Storage.get<boolean>("has_agreed_privacy");
        if (!hasAgreed) {
          setTimeout(() => {
            router.replace("/privacy-policy?showAgree=true");
          }, 0);
        }
      } catch (e) {
        console.error("Initialization failed", e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // Came to foreground
        const authState = useAuthStore.getState();
        const now = Date.now();
        // Add 2s grace period to prevent immediate re-lock after FaceID unlock
        if (authState.isBiometricEnabled && !authState.isAuthenticating && now - authState.lastSuccessTime > 2000) {
          authState.setLocked(true);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.background },
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="flight-log/finish" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="flight-detail/[id]" options={{ title: "飞行详情", headerBackTitle: "返回" }} />
        <Stack.Screen name="flight-detail/edit/[id]" options={{ title: "编辑飞行数据", headerBackTitle: "取消" }} />
        <Stack.Screen name="flight-add/index" options={{ title: "手动记录飞行", headerBackTitle: "取消" }} />
      </Stack>
      <BiometricLockScreen />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
