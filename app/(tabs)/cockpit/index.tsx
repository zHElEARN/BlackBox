import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFlightStore } from "@/store/flightStore";

import { ActiveFlightView } from "@/components/cockpit/active-flight-view";
import { FlightStats } from "@/components/cockpit/flight-stats";
import { GreetingHeader } from "@/components/cockpit/greeting-header";
import { LastFlightCard } from "@/components/cockpit/last-flight-card";

export default function CockpitScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const router = useRouter();

  const { isFlying, takeoffTime, takeoffLat, takeoffLong, takeoffLocation, isLoading, loadingMessage, startFlight, endFlight, discardFlight, stats, lastFlight, loadStats } = useFlightStore();

  const [now, setNow] = useState(Date.now());

  // 始终保持时间更新，用于显示实时时钟
  useFocusEffect(
    useCallback(() => {
      loadStats();
      setNow(Date.now());
      const interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }, [])
  );

  const handleEndFlight = async (type: "NORMAL" | "FORCED") => {
    const trackId = await endFlight(type);
    if (trackId) {
      router.push({
        pathname: "/flight-log/finish",
        params: { id: trackId },
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
        {loadingMessage && <Text style={[styles.loadingText, { color: theme.text }]}>{loadingMessage}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.screenContent}>
        {!isFlying ? (
          <>
            <GreetingHeader now={now} />

            <View style={styles.statsContainer}>
              <LastFlightCard
                lastFlight={lastFlight}
                onPress={() => {
                  if (lastFlight?.id) {
                    router.push(`/flight-detail/${lastFlight.id}`);
                  }
                }}
              />
              <FlightStats stats={stats} />
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: "#44cc44" }]} onPress={startFlight} activeOpacity={0.8}>
              <Text style={styles.buttonText}>开始起飞</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ActiveFlightView now={now} takeoffTime={takeoffTime} takeoffLocation={takeoffLocation} takeoffLat={takeoffLat} takeoffLong={takeoffLong} flightCountToday={stats.today} onEndFlight={handleEndFlight} onDiscard={discardFlight} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  statsContainer: {
    marginBottom: 50,
    alignItems: "center",
    width: "100%",
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
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.8,
  },
});
