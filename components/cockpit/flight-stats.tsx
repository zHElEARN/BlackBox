import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface FlightStatsProps {
  stats: {
    today: number;
    month: number;
  };
}

export const FlightStats = ({ stats }: FlightStatsProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const textSecondary = theme.icon;

  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.text }]}>{stats.today}</Text>
        <Text style={[styles.statLabel, { color: textSecondary }]}>今日起降</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: theme.text }]}>{stats.month}</Text>
        <Text style={[styles.statLabel, { color: textSecondary }]}>本月累计</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
});
