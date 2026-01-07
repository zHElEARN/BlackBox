import { DepartureWindows } from "@/components/radar/departure-windows";
import { FlightHUD } from "@/components/radar/flight-hud";
import { FlightPerformance } from "@/components/radar/flight-performance";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Database } from "@/utils/database";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

interface RadarStats {
  totalFlightHours: number;
  totalMissions: number;
  monthlySorties: number;
  avgDurationMinutes: number;
  hourlyDistribution: number[];
  weeklyDistribution: number[];
  recentExperience: number[];
  landingStats: {
    normal: number;
    forced: number;
  };
  avgExperience: number;
}

export default function RadarScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const [stats, setStats] = useState<RadarStats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const data = await Database.getRadarStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load radar stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlightHUD stats={stats} theme={theme} />
        <DepartureWindows stats={stats} theme={theme} />
        <FlightPerformance stats={stats} theme={theme} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
