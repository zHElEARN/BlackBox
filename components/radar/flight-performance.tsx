import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface LandingStats {
  normal: number;
  forced: number;
}

interface FlightPerformanceProps {
  stats: {
    recentExperience: number[];
    landingStats: LandingStats;
    avgExperience: number;
  } | null;
  theme: typeof Colors.light;
}

export function FlightPerformance({ stats, theme }: FlightPerformanceProps) {
  if (!stats) return null;

  const { recentExperience, landingStats, avgExperience } = stats;
  const totalLandings = landingStats.normal + landingStats.forced;
  const forcedRate = totalLandings > 0 ? landingStats.forced / totalLandings : 0;
  // forcedRate percentage for display
  const normalPercent = totalLandings > 0 ? (landingStats.normal / totalLandings) * 100 : 0;
  const forcedPercent = totalLandings > 0 ? (landingStats.forced / totalLandings) * 100 : 0;

  const showWarning = forcedRate > 0.2; // Alert if > 20% forced landings
  const isDark = theme.text === Colors.dark.text;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>飞行质量评估</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>FLIGHT PERFORMANCE</Text>

      {/* Card 1: Experience Trend */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          飞行体验曲线 <Text style={{ fontSize: 12, fontWeight: "normal", opacity: 0.6 }}>(最近10次)</Text>
        </Text>
        <View style={styles.chartContainer}>
          {recentExperience.length > 0 ? (
            recentExperience.map((score, index) => {
              const heightPercent = (score / 10) * 100;

              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: theme.tint,
                          height: `${heightPercent}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: theme.icon }]}>{score}</Text>
                </View>
              );
            })
          ) : (
            <Text style={{ color: theme.icon, fontSize: 14 }}>暂无评分记录</Text>
          )}
        </View>
      </View>

      {/* Card 2: Detailed Stats */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>综合数据分析</Text>

        <View style={styles.statsGrid}>
          {/* Landing Statistics */}
          <View style={styles.statsColumn}>
            <Text style={[styles.subTitle, { color: theme.icon }]}>降落状态占比</Text>
            <View style={styles.landingBarContainer}>
              {totalLandings > 0 ? (
                <>
                  <View style={[styles.landingBarSegment, { flex: landingStats.normal, backgroundColor: theme.tint }]} />
                  <View style={[styles.landingBarSegment, { flex: landingStats.forced, backgroundColor: theme.icon }]} />
                </>
              ) : (
                <View style={[styles.landingBarSegment, { flex: 1, backgroundColor: theme.border }]} />
              )}
            </View>
            <View style={styles.landingLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: theme.tint }]} />
                <Text style={[styles.legendText, { color: theme.icon }]}>顺利 {totalLandings > 0 ? normalPercent.toFixed(0) : 0}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: theme.icon }]} />
                <Text style={[styles.legendText, { color: theme.icon }]}>迫降 {totalLandings > 0 ? forcedPercent.toFixed(0) : 0}%</Text>
              </View>
            </View>
          </View>

          {/* Average Experience */}
          <View style={styles.statsColumn}>
            <Text style={[styles.subTitle, { color: theme.icon, textAlign: "center" }]}>体验均值</Text>
            <View style={styles.avgContainer}>
              <Text style={[styles.avgScore, { color: theme.text }]}>
                {avgExperience.toFixed(1)}
                <Text style={[styles.avgMax, { color: theme.icon }]}> / 10</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Warning Message */}
      {showWarning && (
        <View
          style={[
            styles.warningContainer,
            {
              backgroundColor: isDark ? "rgba(127, 29, 29, 0.4)" : "#FEF2F2",
              borderColor: isDark ? "rgba(248, 113, 113, 0.2)" : "#FECACA",
            },
          ]}
        >
          <Text style={[styles.warningText, { color: isDark ? "#FECACA" : "#991B1B" }]}>⚠️ 检测到近期飞行环境不稳定，请注意维护</Text>
        </View>
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
  subTitle: {
    fontSize: 12,
    marginBottom: 12,
    opacity: 0.8,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    paddingHorizontal: 4,
  },
  barWrapper: {
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    width: 20,
  },
  barTrack: {
    flex: 1,
    width: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 3,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  landingBarContainer: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  landingBarSegment: {
    height: "100%",
  },
  landingLegend: {
    flexDirection: "column",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  avgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avgScore: {
    fontSize: 36,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  avgMax: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 12,
  },
  warningContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  warningText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
