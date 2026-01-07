import { useUIStore } from "@/store/uiStore";
import { useColorScheme as useSystemColorScheme } from "react-native";

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const themeMode = useUIStore((state) => state.themeMode);

  if (themeMode === "system") {
    return systemColorScheme;
  }
  return themeMode;
}
