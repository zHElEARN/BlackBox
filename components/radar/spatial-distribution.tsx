import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

interface RadarStats {
  topLocations: { name: string; count: number }[];
  geoDiversity: number;
}

interface SpatialDistributionProps {
  stats: RadarStats | null;
  theme: typeof Colors.light;
}

export function SpatialDistribution({ stats, theme }: SpatialDistributionProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>空间与地理轨迹</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.icon }]}>SPATIAL DISTRIBUTION</Text>

      {stats && (
        <>
          {/* Summary Card */}
          <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconContainer, { backgroundColor: theme.tint + "20" }]}>
                <Ionicons name="map-outline" size={24} color={theme.tint} />
              </View>
              <View>
                <Text style={[styles.summaryLabel, { color: theme.icon }]}>地理多样性</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  {stats.geoDiversity} <Text style={[styles.unit, { color: theme.icon }]}>个地点</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Top Locations List */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>常驻机库 (Top Locations)</Text>

            {stats.topLocations.length > 0 ? (
              <View style={styles.listContainer}>
                {stats.topLocations.map((loc, index) => (
                  <View key={index} style={[styles.row, index !== stats.topLocations.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
                    <View style={styles.rankContainer}>
                      <Text style={[styles.rank, { color: index < 3 ? theme.tint : theme.icon }, index < 3 && { fontWeight: "bold" }]}>#{index + 1}</Text>
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={[styles.locationName, { color: theme.text }]} numberOfLines={1}>
                        {loc.name}
                      </Text>
                      <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              backgroundColor: theme.tint,
                              width: `${(loc.count / stats.topLocations[0].count) * 100}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.countContainer}>
                      <Text style={[styles.count, { color: theme.text }]}>{loc.count}</Text>
                      <Text style={[styles.countLabel, { color: theme.icon }]}>次</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.icon }]}>暂无位置数据</Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
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
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 14,
    fontWeight: "normal",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  rankContainer: {
    width: 40,
    justifyContent: "center",
  },
  rank: {
    fontSize: 16,
    fontFamily: "monospace",
  },
  locationInfo: {
    flex: 1,
    marginRight: 16,
  },
  locationName: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    minWidth: 40,
    justifyContent: "flex-end",
  },
  count: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 2,
  },
  countLabel: {
    fontSize: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
});
