import { Database } from "@/utils/database";
import { Stack } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function AboutScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  async function handleFillMockData() {
    try {
      const now = new Date();
      const oneYearAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);

      let count = 0;
      for (let i = 0; i < 60; i++) {
        // Random landing time between one year ago and now
        const landingTimeValue = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));

        // Random duration between 30 minutes and 4 hours
        const durationMinutes = 30 + Math.random() * (240 - 30);
        const takeoffTimeValue = new Date(landingTimeValue.getTime() - durationMinutes * 60 * 1000);

        await Database.addTrack({
          takeoffTime: takeoffTimeValue.toISOString(),
          landingTime: landingTimeValue.toISOString(),
          takeoffLat: 30 + Math.random() * 10, // Approx China Lat
          takeoffLong: 110 + Math.random() * 10, // Approx China Long
          takeoffLocation: `Mock Airport ${Math.floor(Math.random() * 100)}`,
          landingLat: 30 + Math.random() * 10,
          landingLong: 110 + Math.random() * 10,
          landingLocation: `Mock Airfield ${Math.floor(Math.random() * 100)}`,
          landingType: Math.random() > 0.95 ? "FORCED" : "NORMAL",
          note: `Mock Data #${i + 1} generated at ${new Date().toLocaleTimeString()}`,
          flightExperience: Math.floor(Math.random() * 10) + 1,
        });
        count++;
      }
      Alert.alert("Success", `已生成 ${count} 条模拟数据`);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "生成失败");
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom", "left", "right"]}>
      <Stack.Screen
        options={{
          headerTitle: "关于黑匣子",
          headerBackTitle: "返回",
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.text }]}>黑匣子</Text>
          <Text style={[styles.version, { color: theme.icon }]}>Version 1.0.0</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.description, { color: theme.text }]}>
            黑匣子是一款专注于个人飞行记录的应用程序。
            {"\n\n"}
            我们致力于为您提供最便捷、准确的飞行数据记录服务，帮助您珍藏每一次飞行的美好回忆。
            {"\n\n"}
            无论是无论是商务出行还是休闲旅游，黑匣子都将忠实记录您的每一次起降。
          </Text>
        </View>

        {__DEV__ && (
          <TouchableOpacity style={[styles.button, { backgroundColor: colorScheme === "dark" ? "#FFFFFF" : theme.tint }]} onPress={handleFillMockData}>
            <Text style={[styles.buttonText, { color: colorScheme === "dark" ? "#000000" : "#FFFFFF" }]}>生成 Mock 数据 (60条)</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.copyright, { color: theme.icon }]}>&copy; 2026 Zhe_Learn. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    opacity: 0.6,
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: "left",
  },
  copyright: {
    fontSize: 12,
    opacity: 0.4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
