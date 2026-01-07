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

interface FlightHUDProps {
  stats: RadarStats | null;
  theme: typeof Colors.light;
}

export function FlightHUD({ stats, theme }: FlightHUDProps) {
  return (
    <View>
      {/* Flight HUD Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>核心飞行简报</Text>
        <Text style={[styles.headerSubtitle, { color: theme.icon }]}>FLIGHT HUD</Text>
      </View>

      {/* HUD Grid */}
      <View style={[styles.hudContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
        {/* Row 1 */}
        <View style={[styles.row, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
          <View style={[styles.cell, { borderRightColor: theme.border, borderRightWidth: 1 }]}>
            <Text style={[styles.label, { color: theme.icon }]}>累计总工时</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {stats?.totalFlightHours.toFixed(1)} <Text style={styles.unit}>h</Text>
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={[styles.label, { color: theme.icon }]}>总任务次数</Text>
            <Text style={[styles.value, { color: theme.text }]}>{stats?.totalMissions}</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <View style={[styles.cell, { borderRightColor: theme.border, borderRightWidth: 1 }]}>
            <Text style={[styles.label, { color: theme.icon }]}>本月飞行频次</Text>
            <Text style={[styles.value, { color: theme.text }]}>{stats?.monthlySorties}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={[styles.label, { color: theme.icon }]}>平均航程</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {stats ? Math.round(stats.avgDurationMinutes) : 0} <Text style={styles.unit}>min</Text>
            </Text>
          </View>
        </View>

        {/* Decorative HUD Elements */}
        <View style={[styles.corner, styles.cornerTL, { borderColor: theme.tint }]} />
        <View style={[styles.corner, styles.cornerTR, { borderColor: theme.tint }]} />
        <View style={[styles.corner, styles.cornerBL, { borderColor: theme.tint }]} />
        <View style={[styles.corner, styles.cornerBR, { borderColor: theme.tint }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: 4,
    opacity: 0.7,
  },
  hudContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    padding: 4,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 32,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  unit: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.7,
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderTopColor: "inherit",
    borderLeftColor: "inherit",
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderTopColor: "inherit",
    borderRightColor: "inherit",
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderBottomColor: "inherit",
    borderLeftColor: "inherit",
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderBottomColor: "inherit",
    borderRightColor: "inherit",
    borderBottomRightRadius: 12,
  },
});
