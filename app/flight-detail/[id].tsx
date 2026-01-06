import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { FlightRecordCard } from "@/components/flight-record-card";
import { Colors } from "@/constants/theme";
import { FlightTrack } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Database } from "@/utils/database";

export default function FlightDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [track, setTrack] = useState<FlightTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrack = async () => {
      if (!id) return;
      try {
        const data = await Database.getTrackById(Number(id));
        setTrack(data);
      } catch (error) {
        console.error("Failed to load track:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrack();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  if (!track) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>未找到飞行记录</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: `详情 #${track.id}`,
          headerTintColor: theme.text,
          headerBackTitle: "返回",
        }}
      />

      {/* 复用外部卡片设计：传入空 onPress 禁用跳转 */}
      <FlightRecordCard track={track} style={styles.cardOverride} onPress={() => {}} />

      {/* 详细坐标信息 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.icon }]}>地理位置</Text>

        <View style={[styles.infoRow, { backgroundColor: theme.card }]}>
          <View style={styles.infoIcon}>
            <Ionicons name="location" size={20} color="#4CAF50" />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.icon }]}>起飞位置</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{track.takeoffLat !== null ? `${track.takeoffLat.toFixed(6)}, ${track.takeoffLong?.toFixed(6)}` : "未记录"}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { backgroundColor: theme.card }]}>
          <View style={styles.infoIcon}>
            <Ionicons name="location" size={20} color="#F44336" />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.icon }]}>降落位置</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{track.landingLat !== null ? `${track.landingLat.toFixed(6)}, ${track.landingLong?.toFixed(6)}` : "未记录"}</Text>
          </View>
        </View>
      </View>

      {/* 备注信息 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.icon }]}>飞行备注</Text>
        <View style={[styles.noteContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.noteText, { color: track.note ? theme.text : theme.icon, fontStyle: track.note ? "normal" : "italic" }]}>{track.note || "无备注"}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  cardOverride: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  noteContainer: {
    padding: 16,
    borderRadius: 16,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
