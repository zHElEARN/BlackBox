import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFlightStore } from "@/store/flightStore";

const getDuration = (startTime: number | null, now: number) => {
  if (!startTime) return "00:00:00";
  const diff = Math.max(0, now - startTime);

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const fmt = (n: number) => n.toString().padStart(2, "0");
  return `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`;
};

export default function CockpitScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { isFlying, takeoffTime, isLoading, startFlight, endFlight } = useFlightStore();

  const [now, setNow] = useState(Date.now());

  useFocusEffect(
    useCallback(() => {
      let interval: ReturnType<typeof setInterval>;

      if (isFlying) {
        setNow(Date.now()); // 聚焦时立即校准一次
        interval = setInterval(() => {
          setNow(Date.now());
        }, 1000);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isFlying])
  );

  const duration = isFlying ? getDuration(takeoffTime, now) : "00:00:00";

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {!isFlying ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: "#44cc44" }]} onPress={startFlight} activeOpacity={0.8}>
          <Text style={styles.buttonText}>开始起飞</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#ff4444" }]} onPress={() => endFlight("NORMAL")} activeOpacity={0.8}>
            <Text style={styles.buttonText}>成功降落</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.forcedButton]} onPress={() => endFlight("FORCED")} activeOpacity={0.8}>
            <Text style={styles.forcedButtonText}>紧急迫降</Text>
          </TouchableOpacity>
        </View>
      )}

      {isFlying && takeoffTime && (
        <View style={styles.infoContainer}>
          <Text style={[styles.timer, { color: theme.text }]}>{duration}</Text>
          <Text style={[styles.infoLabel, { color: theme.text }]}>起飞时间: {new Date(takeoffTime).toLocaleTimeString()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContainer: {
    alignItems: "center",
    gap: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  forcedButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  forcedButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  infoContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
