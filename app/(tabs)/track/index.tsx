import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

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

  const renderItem = ({ item }: { item: FlightTrack }) => (
    <FlightRecordCard track={item} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>暂无飞行记录</Text>
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
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    opacity: 0.5,
  },
});
