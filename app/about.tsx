import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function AboutScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

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
});
