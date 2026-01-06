import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

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
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>ID:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{item.id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>起飞:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{new Date(item.takeoffTime).toLocaleString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>降落:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{new Date(item.landingTime).toLocaleString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>类型:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{item.landingType === "NORMAL" ? "普通" : "迫降"}</Text>
      </View>
    </View>
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
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(128,128,128,0.2)",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    width: 40,
  },
  value: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    opacity: 0.5,
  },
});
