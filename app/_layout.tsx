import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFlightStore } from "@/store/flightStore";
import { Database } from "@/utils/database";
import { Storage } from "@/utils/storage";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const router = useRouter();

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

        const hasAgreed = await Storage.get<boolean>("has_agreed_privacy");
        if (!hasAgreed) {
          setTimeout(() => {
            router.replace("/privacy-policy?showAgree=true");
          }, 0);
        }
      } catch (e) {
        console.error("Initialization failed", e);
      }
    }

    prepare();
  }, []);

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
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
