import { useFocusEffect } from "expo-router";
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

  const handleLongPress = (track: FlightTrack) => {
    Alert.alert("航班操作", "", [
      {
        text: "删除",
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
      { text: "查看详情", onPress: () => console.log("查看详情") },
      { text: "取消", style: "cancel" },
    ]);
  };

  const renderItem = ({ item }: { item: FlightTrack }) => <FlightRecordCard track={item} onLongPress={handleLongPress} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.icon }]}>暂无飞行记录</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
