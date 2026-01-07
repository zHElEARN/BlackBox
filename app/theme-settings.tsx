import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeMode, useUIStore } from "@/store/uiStore";

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const { themeMode, setThemeMode } = useUIStore();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const options: { label: string; value: ThemeMode; icon: string }[] = [
    { label: "系统默认", value: "system", icon: "theme-light-dark" },
    { label: "浅色模式", value: "light", icon: "weather-sunny" },
    { label: "深色模式", value: "dark", icon: "weather-night" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "应用主题",
          headerBackTitle: "返回",
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          {options.map((option, index) => {
            const isSelected = themeMode === option.value;
            const isLast = index === options.length - 1;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  !isLast && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => setThemeMode(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.tint + "15" }]}>
                    <MaterialCommunityIcons name={option.icon as any} size={22} color={theme.tint} />
                  </View>
                  <Text style={[styles.optionLabel, { color: theme.text }]}>{option.label}</Text>
                </View>
                {isSelected && <MaterialCommunityIcons name="check" size={24} color={theme.tint} />}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[styles.description, { color: theme.icon }]}>选择“系统默认”将跟随您的设备系统设置自动切换深色或浅色模式。</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    borderRadius: 16,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
    marginTop: 12,
    marginHorizontal: 16,
    opacity: 0.6,
    lineHeight: 18,
  },
});
