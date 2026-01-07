import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { FlightTrack } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getDuration } from "@/utils/time";

interface LastFlightCardProps {
  lastFlight: FlightTrack | null;
  onPress?: () => void;
}

export const LastFlightCard = ({ lastFlight, onPress }: LastFlightCardProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  if (!lastFlight) return null;

  const textSecondary = theme.icon;
  const cardBackground = theme.card;

  const end = new Date(lastFlight.landingTime).getTime();
  const start = new Date(lastFlight.takeoffTime).getTime();
  const takeoffDate = new Date(lastFlight.takeoffTime);
  const landingDate = new Date(lastFlight.landingTime);

  // Time ago calculation
  const diffMin = Math.floor((Date.now() - end) / 60000);
  const timeAgo = diffMin < 1 ? "刚刚" : diffMin < 60 ? `${diffMin}分钟前` : diffMin < 1440 ? `${Math.floor(diffMin / 60)}小时前` : `${Math.floor(diffMin / 1440)}天前`;

  const flightDuration = getDuration(start, end);

  // Use City + District for location
  const formatCity = (locationJson: string | null) => {
    if (!locationJson) return "未知";
    try {
      const addr = JSON.parse(locationJson);
      const city = addr.city || addr.province || "";
      const district = addr.district || "";
      const result = `${city}${district}`.trim();
      return result || "未知位置";
    } catch {
      return "未知";
    }
  };

  const isAbnormal = lastFlight.landingType !== "NORMAL";

  const renderBadge = () => {
    if (isAbnormal) {
      return (
        <View style={[styles.badge, { backgroundColor: "rgba(244, 67, 54, 0.1)" }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color="#F44336" style={{ marginRight: 4 }} />
          <Text style={[styles.badgeText, { color: "#F44336" }]}>{lastFlight.landingType === "FORCED" ? "迫降" : "异常"}</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, { backgroundColor: "rgba(76, 175, 80, 0.1)" }]}>
        <MaterialCommunityIcons name="check-circle-outline" size={14} color="#4CAF50" style={{ marginRight: 4 }} />
        <Text style={[styles.badgeText, { color: "#4CAF50" }]}>安全降落</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: cardBackground }]} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="history" size={18} color={theme.tint} style={{ marginRight: 6 }} />
          <Text style={[styles.title, { color: theme.text }]}>前序航班</Text>
          <Text style={[styles.timeAgo, { color: textSecondary }]}> • {timeAgo}</Text>
        </View>
        {renderBadge()}
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        {/* Output/Takeoff */}
        <View style={styles.locationCol}>
          <Text style={[styles.timeText, { color: theme.text }]}>{takeoffDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</Text>
          <Text style={[styles.cityText, { color: textSecondary }]} numberOfLines={1}>
            {formatCity(lastFlight.takeoffLocation)}
          </Text>
        </View>

        {/* Path Visual */}
        <View style={styles.pathContainer}>
          <Text style={[styles.durationText, { color: theme.tint }]}>{flightDuration}</Text>
          <View style={styles.pathVisual}>
            <View style={[styles.dot, { backgroundColor: theme.tint }]} />
            <View style={[styles.line, { backgroundColor: theme.tint }]} />
            <MaterialCommunityIcons name="airplane" size={20} color={theme.tint} style={styles.planeIcon} />
            <View style={[styles.line, { backgroundColor: theme.tint }]} />
            <View style={[styles.dot, { backgroundColor: theme.tint }]} />
          </View>
        </View>

        {/* Arrival/Landing */}
        <View style={[styles.locationCol, { alignItems: "flex-end" }]}>
          <Text style={[styles.timeText, { color: theme.text }]}>{landingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</Text>
          <Text style={[styles.cityText, { color: textSecondary }]} numberOfLines={1}>
            {formatCity(lastFlight.landingLocation)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  timeAgo: {
    fontSize: 13,
    fontWeight: "400",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 20,
    width: "100%",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationCol: {
    flex: 1,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    fontVariant: ["tabular-nums"],
  },
  cityText: {
    fontSize: 13,
  },
  pathContainer: {
    flex: 1.2,
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 6,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    fontVariant: ["tabular-nums"],
  },
  pathVisual: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  line: {
    flex: 1,
    height: 1.5,
    opacity: 0.2, // Slightly more subtle
  },
  planeIcon: {
    marginHorizontal: 4,
    transform: [{ rotate: "45deg" }],
  },
});
