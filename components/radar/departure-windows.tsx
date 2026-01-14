import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

interface RadarStats {
  totalFlightHours: number;
  totalMissions: number;
  monthlySorties: number;
  avgDurationMinutes: number;
  hourlyDistribution: number[];
  weeklyDistribution: number[];
}

interface DepartureWindowsProps {
  stats: RadarStats | null;
  theme: typeof Colors.light;
}

export function DepartureWindows({ stats, theme }: DepartureWindowsProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>时间分布分析</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>DEPARTURE WINDOWS</Text>

      {stats && (
        <>
          {/* 24h Hourly Distribution */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>全天出动热力图</Text>
            <View style={styles.chartContainer}>
              {stats.hourlyDistribution.map((count, index) => (
                <View key={index} style={styles.hourlyBarWrapper}>
                  <View
                    style={[
                      styles.hourlyBar,
                      {
                        height: Math.max(4, (count / (Math.max(...stats.hourlyDistribution) || 1)) * 80),
                        backgroundColor: count > 0 ? theme.tint : theme.border,
                      },
                    ]}
                  />
                  {index % 6 === 0 && <Text style={[styles.axisLabel, { color: theme.icon }]}>{index}</Text>}
                </View>
              ))}
            </View>
          </View>

          {/* Weekly Distribution */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>周活跃趋势</Text>
            <View style={styles.weeklyChartContainer}>
              {["周日", "周一", "周二", "周三", "周四", "周五", "周六"].map((day, index) => {
                const count = stats.weeklyDistribution[index];
                const max = Math.max(...stats.weeklyDistribution) || 1;
                return (
                  <View key={index} style={styles.weeklyBarWrapper}>
                    <Text style={[styles.barValue, { color: theme.text }]}>{count > 0 ? count : ""}</Text>
                    <View
                      style={[
                        styles.weeklyBar,
                        {
                          height: Math.max(4, (count / max) * 100),
                          backgroundColor: count > 0 ? theme.tint : theme.border,
                        },
                      ]}
                    />
                    <Text style={[styles.weeklyLabel, { color: theme.icon }]}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: 4,
    opacity: 0.7,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 100,
    paddingHorizontal: 4,
  },
  hourlyBarWrapper: {
    alignItems: "center",
    width: "3%",
  },
  hourlyBar: {
    width: "100%",
    borderRadius: 2,
  },
  axisLabel: {
    fontSize: 9,
    marginTop: 4,
    position: "absolute",
    bottom: -16,
    width: 20,
    textAlign: "center",
  },
  weeklyChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 160,
  },
  weeklyBarWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  weeklyBar: {
    width: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  weeklyLabel: {
    fontSize: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  barValue: {
    fontSize: 10,
    marginBottom: 2,
  },
});
