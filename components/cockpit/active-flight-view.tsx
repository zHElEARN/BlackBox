import React, { useEffect, useRef } from "react";
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatLocation } from "@/utils/location";
import { getDuration } from "@/utils/time";

import { LongPressButton } from "./long-press-button";

interface ActiveFlightViewProps {
  now: number;
  takeoffTime: number | null;
  takeoffLocation: string | null;
  takeoffLat: number | null;
  takeoffLong: number | null;
  flightCountToday: number;
  onEndFlight: (type: "NORMAL" | "FORCED") => void;
  onDiscard: () => void;
}

export const ActiveFlightView = ({ now, takeoffTime, takeoffLocation, takeoffLat, takeoffLong, flightCountToday, onEndFlight, onDiscard }: ActiveFlightViewProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const textSecondary = theme.icon;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Recording dot animation
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [fadeAnim]);

  const duration = getDuration(takeoffTime, now);

  const handleDiscardPress = () => {
    Alert.alert("放弃本次记录", "确定要放弃本次飞行记录吗？该操作无法撤销。", [
      { text: "取消", style: "cancel" },
      {
        text: "确定放弃",
        style: "destructive",
        onPress: onDiscard,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.flyingHeader}>
        <View style={styles.statusBadge}>
          <Animated.View style={[styles.recordingDot, { opacity: fadeAnim }]} />
          <Text style={styles.statusText}>REC</Text>
        </View>
        <Text style={[styles.flyingClock, { color: textSecondary }]}>{new Date(now).toLocaleTimeString()}</Text>
      </View>

      <View style={styles.flightSeqContainer}>
        <Text style={[styles.flightSeqText, { color: theme.tint }]}>今日第 {flightCountToday + 1} 次飞行</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={[styles.timer, { color: theme.text }]}>{duration}</Text>
      </View>

      <View style={styles.flightInfoContainer}>
        <View style={styles.flightInfoRow}>
          <Text style={[styles.flightInfoLabel, { color: textSecondary }]}>起飞时间</Text>
          <Text style={[styles.flightInfoValue, { color: theme.text }]}>{takeoffTime ? new Date(takeoffTime).toLocaleTimeString() : "--:--:--"}</Text>
        </View>
        {takeoffLocation && (
          <View style={styles.flightInfoRow}>
            <Text style={[styles.flightInfoLabel, { color: textSecondary }]}>起飞地点</Text>
            <Text style={[styles.flightInfoValue, { color: theme.text }]} numberOfLines={1}>
              {formatLocation(takeoffLocation)}
            </Text>
          </View>
        )}
        {takeoffLat && takeoffLong && (
          <View style={styles.flightInfoRow}>
            <Text style={[styles.flightInfoLabel, { color: textSecondary }]}>坐标</Text>
            <Text style={[styles.flightInfoValue, { color: theme.text }]}>
              {takeoffLat.toFixed(4)}, {takeoffLong.toFixed(4)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <LongPressButton title="安全降落" onLongPress={() => onEndFlight("NORMAL")} backgroundColor="#ff4444" duration={2000} buttonStyle={styles.shadowStyle} textStyle={{ fontSize: 24 }} />

        <LongPressButton title="紧急迫降" onLongPress={() => onEndFlight("FORCED")} backgroundColor="transparent" textColor="#ff4444" progressColor="rgba(255, 68, 68, 0.1)" duration={2000} style={{ marginTop: 8 }} textStyle={{ fontSize: 16 }} />

        <TouchableOpacity style={styles.discardButton} onPress={handleDiscardPress} activeOpacity={0.8}>
          <Text style={[styles.discardButtonText, { color: textSecondary }]}>放弃记录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  flyingHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
  },
  statusText: {
    color: "#ff4444",
    fontSize: 12,
    fontWeight: "bold",
  },
  flyingClock: {
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  flightSeqContainer: {
    marginBottom: 20,
  },
  flightSeqText: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.9,
  },
  timerContainer: {
    marginBottom: 40,
  },
  timer: {
    fontSize: 64,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  flightInfoContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  flightInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flightInfoLabel: {
    fontSize: 14,
  },
  flightInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    maxWidth: "70%",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  shadowStyle: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  discardButton: {
    marginTop: 10,
    padding: 10,
  },
  discardButtonText: {
    fontSize: 14,
  },
});
