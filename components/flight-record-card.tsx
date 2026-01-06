import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { FlightTrack } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface FlightRecordCardProps {
  track: FlightTrack;
  style?: ViewStyle;
}

export function FlightRecordCard({ track, style }: FlightRecordCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const takeoffDate = new Date(track.takeoffTime);
  const landingDate = new Date(track.landingTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = () => {
    const diff = landingDate.getTime() - takeoffDate.getTime();
    if (isNaN(diff)) return "--";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }, style]}>
      <View style={styles.header}>
        <Text style={[styles.date, { color: theme.icon }]}>{formatDate(takeoffDate)}</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: track.landingType === "NORMAL" ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: track.landingType === "NORMAL" ? "#4CAF50" : "#F44336" }]}>{track.landingType === "NORMAL" ? "成功降落" : "迫降"}</Text>
        </View>
      </View>

      <View style={styles.flightInfo}>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeLabel, { color: theme.icon }]}>起飞</Text>
          <Text style={[styles.time, { color: theme.text }]}>{formatTime(takeoffDate)}</Text>
          {track.takeoffLocation && (
            <Text style={[styles.location, { color: theme.icon }]} numberOfLines={1}>
              {track.takeoffLocation}
            </Text>
          )}
        </View>

        <View style={styles.pathContainer}>
          <Text style={[styles.durationLabel, { color: theme.icon }]}>{calculateDuration()}</Text>
          <View style={styles.pathVisual}>
            <View style={[styles.pathLine, { backgroundColor: theme.icon, opacity: 0.2 }]} />
            <MaterialCommunityIcons name="airplane" size={24} color={theme.tint} style={styles.planeIcon} />
            <View style={[styles.pathLine, { backgroundColor: theme.icon, opacity: 0.2 }]} />
          </View>
        </View>

        <View style={[styles.timeContainer, { alignItems: "flex-end" }]}>
          <Text style={[styles.timeLabel, { color: theme.icon }]}>降落</Text>
          <Text style={[styles.time, { color: theme.text }]}>{formatTime(landingDate)}</Text>
          {track.landingLocation && (
            <Text style={[styles.location, { color: theme.icon }]} numberOfLines={1}>
              {track.landingLocation}
            </Text>
          )}
        </View>
      </View>

      {track.note && (
        <View style={styles.footer}>
          <Ionicons name="chatbox-outline" size={14} color={theme.icon} />
          <Text style={[styles.note, { color: theme.icon }]} numberOfLines={1}>
            备注: {track.note}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  flightInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  location: {
    fontSize: 12,
    marginTop: 4,
  },
  pathContainer: {
    flex: 1,
    maxWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  pathVisual: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  pathLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderRadius: 1,
  },
  planeIcon: {
    marginHorizontal: 4,
    transform: [{ rotate: "45deg" }],
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  note: {
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: 4,
    flex: 1,
  },
});
