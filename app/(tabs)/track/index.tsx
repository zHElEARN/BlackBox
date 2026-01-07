import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

import { FlightRecordCard } from "@/components/flight-record-card";
import { Colors } from "@/constants/theme";
import { FlightTrack } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Database } from "@/utils/database";

export default function TrackScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const [tracks, setTracks] = useState<FlightTrack[]>([]);
  const router = useRouter();

  const loadTracks = async () => {
    try {
      const data = await Database.getTracks();
      setTracks(data);
    } catch (error) {
      console.error("Failed to load tracks:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTracks();
    }, [])
  );

  // 为详情页准备返回文字
  const goToDetail = (track: FlightTrack) => {
    router.push({
      pathname: "/flight-detail/[id]",
      params: { id: track.id.toString() },
    } as any);
  };

  const handleLongPress = (track: FlightTrack) => {
    Alert.alert("请选择操作", `飞行记录 #${track.id}`, [
      {
        text: "删除记录",
        style: "destructive",
        onPress: () => {
          Alert.alert("确认删除", "确定要删除这条飞行记录吗？此操作不可撤销。", [
            { text: "取消", style: "cancel" },
            {
              text: "确认删除",
              style: "destructive",
              onPress: async () => {
                try {
                  await Database.deleteTrack(track.id);
                  loadTracks();
                } catch (error) {
                  console.error("Failed to delete track:", error);
                  Alert.alert("错误", "删除失败，请重试");
                }
              },
            },
          ]);
        },
      },
      {
        text: "查看详情",
        onPress: () => goToDetail(track),
      },
      { text: "取消", style: "cancel" },
    ]);
  };

  const renderItem = ({ item }: { item: FlightTrack }) => <FlightRecordCard track={item} onLongPress={handleLongPress} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {tracks.length > 0 ? (
        <FlatList data={tracks} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.listContent} />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="airplane-outline" size={64} color={theme.icon} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, { color: theme.icon }]}>暂无飞行记录</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    opacity: 0.4,
  },
});
