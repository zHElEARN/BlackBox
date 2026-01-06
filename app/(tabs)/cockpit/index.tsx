import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFlightStore } from "@/store/flightStore";
import { Database } from "@/utils/database";

export default function CockpitScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { isFlying, takeoffTime, startFlight, endFlight } = useFlightStore();

  const handleLanding = async () => {
    if (!takeoffTime) return;

    try {
      await Database.addTrack({
        takeoffTime: new Date(takeoffTime).toISOString(),
        landingTime: new Date().toISOString(),
        landingType: "NORMAL",
      });
      endFlight();
      Alert.alert("降落成功", "飞行记录已保存");
    } catch (error) {
      console.error(error);
      Alert.alert("错误", "保存飞行记录失败");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity style={[styles.button, { backgroundColor: isFlying ? "#ff4444" : "#44cc44" }]} onPress={isFlying ? handleLanding : startFlight} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{isFlying ? "降落" : "开始起飞"}</Text>
      </TouchableOpacity>

      {isFlying && takeoffTime && (
        <View style={styles.infoContainer}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>起飞时间</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{new Date(takeoffTime).toLocaleTimeString()}</Text>
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
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 30,
    alignItems: "center",
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
