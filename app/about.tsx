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

      const CITIES = [
        { city: "北京市", district: "朝阳区", street: "建国路", lat: 39.9042, long: 116.4074 },
        { city: "上海市", district: "浦东新区", street: "世纪大道", lat: 31.2304, long: 121.4737 },
        { city: "广州市", district: "天河区", street: "天河路", lat: 23.1291, long: 113.2644 },
        { city: "深圳市", district: "南山区", street: "深南大道", lat: 22.5431, long: 114.0579 },
        { city: "成都市", district: "武侯区", street: "人民南路", lat: 30.5728, long: 104.0668 },
        { city: "杭州市", district: "西湖区", street: "西湖大道", lat: 30.2741, long: 120.1551 },
        { city: "西安市", district: "雁塔区", street: "长安路", lat: 34.3416, long: 108.9398 },
        { city: "武汉市", district: "武昌区", street: "珞珈山路", lat: 30.5928, long: 114.3055 },
      ];

      let count = 0;
      for (let i = 0; i < 60; i++) {
        // Random landing time between one year ago and now
        const landingTimeValue = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));

        // Random duration between 30 minutes and 4 hours
        const durationMinutes = 30 + Math.random() * (240 - 30);
        const takeoffTimeValue = new Date(landingTimeValue.getTime() - durationMinutes * 60 * 1000);

        const takeoffCity = CITIES[Math.floor(Math.random() * CITIES.length)];
        const landingCity = CITIES[Math.floor(Math.random() * CITIES.length)];

        // Random offset for coordinates to make them slightly different
        const takeoffLat = takeoffCity.lat + (Math.random() - 0.5) * 0.1;
        const takeoffLong = takeoffCity.long + (Math.random() - 0.5) * 0.1;
        const landingLat = landingCity.lat + (Math.random() - 0.5) * 0.1;
        const landingLong = landingCity.long + (Math.random() - 0.5) * 0.1;

        await Database.addTrack({
          takeoffTime: takeoffTimeValue.toISOString(),
          landingTime: landingTimeValue.toISOString(),
          takeoffLat: takeoffLat,
          takeoffLong: takeoffLong,
          takeoffLocation: JSON.stringify({
            country: "中国",
            province: takeoffCity.city, // Simplified for mock
            city: takeoffCity.city,
            district: takeoffCity.district,
            street: takeoffCity.street,
          }),
          landingLat: landingLat,
          landingLong: landingLong,
          landingLocation: JSON.stringify({
            country: "中国",
            province: landingCity.city,
            city: landingCity.city,
            district: landingCity.district,
            street: landingCity.street,
          }),
          landingType: Math.random() > 0.95 ? "FORCED" : "NORMAL",
          note: `模拟数据 #${i + 1} - 由系统自动生成`,
          flightExperience: Math.floor(Math.random() * 5) + 6, // 6-10 分
        });
        count++;
      }
      Alert.alert("生成成功", `已成功生成 ${count} 条模拟飞行数据。刷新页面即可查看。`);
    } catch (e) {
      console.error(e);
      Alert.alert("生成失败", "模拟数据生成过程中发生错误。");
    }
  }

  const handleClearDatabase = () => {
    Alert.alert("确认清空", "确定要清空所有飞行记录吗？此操作无法撤销！", [
      { text: "取消", style: "cancel" },
      {
        text: "确定清空",
        style: "destructive",
        onPress: async () => {
          try {
            await Database.clearAllTracks();
            Alert.alert("操作成功", "所有数据库记录已清空。");
          } catch (e) {
            console.error(e);
            Alert.alert("操作失败", "无法清空数据库。");
          }
        },
      },
    ]);
  };

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
          <Text style={[styles.appName, { color: theme.text }]}>黑匣子 App</Text>
          <Text style={[styles.version, { color: theme.icon }]}>BlackBox App</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.description, { color: theme.text }]}>
            黑匣子 "BlackBox" 是一款专注于个人飞行记录的专业应用程序。
            {"\n\n"}
            我们致力于为您提供最便捷、精准的飞行数据记录服务，帮助您珍藏每一次飞行的独特体验。
            {"\n\n"}
            利用定位技术和直观的数据可视化，黑匣子将成为您探索天空的最佳伴侣。
          </Text>
        </View>

        {__DEV__ && (
          <View style={styles.devSection}>
            <Text style={[styles.sectionTitle, { color: theme.icon }]}>数据管理</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: colorScheme === "dark" ? "#FFFFFF" : theme.tint }]} onPress={handleFillMockData}>
              <Text style={[styles.buttonText, { color: colorScheme === "dark" ? "#000000" : "#FFFFFF" }]}>生成 60 条模拟数据</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: "#ff4444" }]} onPress={handleClearDatabase}>
              <Text style={styles.buttonText}>清空数据库 (慎用)</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.copyright, { color: theme.icon }]}>Design & Developed by</Text>
          <Text style={[styles.author, { color: theme.text }]}>Zhe_Learn</Text>
          <Text style={[styles.copyright, { color: theme.icon, marginTop: 4 }]}>&copy; 2026 BlackBox Inc. All rights reserved.</Text>
        </View>
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
    marginBottom: 32,
    marginTop: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 1,
  },
  version: {
    fontSize: 14,
    opacity: 0.6,
    fontFamily: "Courier",
  },
  card: {
    width: "100%",
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 26,
    textAlign: "left",
    opacity: 0.9,
  },
  devSection: {
    width: "100%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
    marginLeft: 4,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  copyright: {
    fontSize: 12,
    opacity: 0.5,
  },
  author: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
});
