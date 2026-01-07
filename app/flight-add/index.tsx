import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Database } from "@/utils/database";

export default function AddFlightScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const [takeoffDate, setTakeoffDate] = useState<Date>(oneHourAgo);
  const [landingDate, setLandingDate] = useState<Date>(now);

  // Picker visibility
  const [showPicker, setShowPicker] = useState<{
    type: "takeoff" | "landing";
    mode: "date" | "time";
  } | null>(null);

  const togglePicker = (type: "takeoff" | "landing", mode: "date" | "time") => {
    if (showPicker?.type === type && showPicker?.mode === mode) {
      setShowPicker(null);
    } else {
      setShowPicker({ type, mode });
    }
  };

  const [note, setNote] = useState("");
  const [rating, setRating] = useState(0);
  const [landingType, setLandingType] = useState<"NORMAL" | "FORCED">("NORMAL");

  const handleSave = async () => {
    if (!takeoffDate || !landingDate) {
      Alert.alert("错误", "请填写完整的起飞和降落时间");
      return;
    }

    if (landingDate <= takeoffDate) {
      Alert.alert("不可达到的飞行", "降落时间必须在起飞时间之后");
      return;
    }

    setIsSaving(true);
    try {
      await Database.addTrack({
        takeoffTime: takeoffDate.toISOString(),
        landingTime: landingDate.toISOString(),
        note: note.trim() || null,
        flightExperience: rating > 0 ? Math.round(rating * 2) : null,
        landingType,
        // 其他字段留空
        takeoffLat: null,
        takeoffLong: null,
        takeoffLocation: null,
        landingLat: null,
        landingLong: null,
        landingLocation: null,
      });
      router.back();
    } catch (error) {
      console.error("Failed to add flight track:", error);
      Alert.alert("错误", "保存失败，请稍后再试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStarPress = (star: number) => {
    if (rating === star) {
      setRating(star - 0.5);
    } else {
      setRating(star);
    }
  };

  const getStarIcon = (star: number) => {
    if (rating >= star) return "star";
    if (rating >= star - 0.5) return "star-half";
    return "star-outline";
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            title: "手动记录飞行",
            headerTintColor: theme.text,
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.headerRightBtn}>
                {isSaving ? <ActivityIndicator size="small" color={theme.tint} /> : <Text style={[styles.saveBtn, { color: theme.tint }]}>完成</Text>}
              </TouchableOpacity>
            ),
          }}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={20} color={theme.icon} />
            <Text style={[styles.infoText, { color: theme.icon }]}>此处手动录入的飞行记录将不包含GPS轨迹信息</Text>
          </View>

          {/* Time Section */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>起飞与降落时间</Text>

            <View style={[styles.timeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {/* Takeoff Row */}
              <View style={styles.timeRow}>
                <View style={styles.timeLabelGroup}>
                  <Ionicons name="airplane-outline" size={18} color="#4CAF50" style={{ transform: [{ rotate: "-45deg" }] }} />
                  <Text style={[styles.timeRowLabel, { color: theme.text }]}>起飞</Text>
                </View>
                <View style={styles.pickersContainer}>
                  <TouchableOpacity onPress={() => togglePicker("takeoff", "date")} style={[styles.pickerBtn, { backgroundColor: theme.background, borderColor: showPicker?.type === "takeoff" && showPicker?.mode === "date" ? theme.tint : "transparent", borderWidth: 1 }]}>
                    <Text style={{ color: theme.text }}>{takeoffDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => togglePicker("takeoff", "time")} style={[styles.pickerBtn, { backgroundColor: theme.background, borderColor: showPicker?.type === "takeoff" && showPicker?.mode === "time" ? theme.tint : "transparent", borderWidth: 1 }]}>
                    <Text style={{ color: theme.text }}>{takeoffDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              {/* Landing Row */}
              <View style={styles.timeRow}>
                <View style={styles.timeLabelGroup}>
                  <Ionicons name="airplane-outline" size={18} color="#F44336" style={{ transform: [{ rotate: "45deg" }] }} />
                  <Text style={[styles.timeRowLabel, { color: theme.text }]}>降落</Text>
                </View>
                <View style={styles.pickersContainer}>
                  <TouchableOpacity onPress={() => togglePicker("landing", "date")} style={[styles.pickerBtn, { backgroundColor: theme.background, borderColor: showPicker?.type === "landing" && showPicker?.mode === "date" ? theme.tint : "transparent", borderWidth: 1 }]}>
                    <Text style={{ color: theme.text }}>{landingDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => togglePicker("landing", "time")} style={[styles.pickerBtn, { backgroundColor: theme.background, borderColor: showPicker?.type === "landing" && showPicker?.mode === "time" ? theme.tint : "transparent", borderWidth: 1 }]}>
                    <Text style={{ color: theme.text }}>{landingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {showPicker && (
            <View style={[styles.pickerContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.text }]}>
                  选择{showPicker.type === "takeoff" ? "起飞" : "降落"}
                  {showPicker.mode === "date" ? "日期" : "时间"}
                </Text>
                <TouchableOpacity onPress={() => setShowPicker(null)}>
                  <Text style={{ color: theme.tint, fontWeight: "600" }}>确定</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={showPicker.type === "takeoff" ? takeoffDate : landingDate}
                mode={showPicker.mode}
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  if (Platform.OS === "android") {
                    setShowPicker(null);
                  }
                  if (selectedDate) {
                    if (showPicker.type === "takeoff") {
                      setTakeoffDate(selectedDate);
                    } else {
                      setLandingDate(selectedDate);
                    }
                  }
                }}
              />
            </View>
          )}

          {/* Landing Type */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>降落类型</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity style={[styles.typeButton, landingType === "NORMAL" && { backgroundColor: theme.tint }, { borderColor: theme.tint, borderWidth: 1 }]} onPress={() => setLandingType("NORMAL")}>
                <Text style={[styles.typeText, { color: landingType === "NORMAL" ? (colorScheme === "dark" ? "#000" : "#fff") : theme.tint }]}>成功降落</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, landingType === "FORCED" && { backgroundColor: "#F44336" }, { borderColor: "#F44336", borderWidth: 1 }]} onPress={() => setLandingType("FORCED")}>
                <Text style={[styles.typeText, { color: landingType === "FORCED" ? "#fff" : "#F44336" }]}>迫降</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Experience Section */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>飞行体验 ({rating > 0 ? rating * 2 : 0}分)</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleStarPress(star)} activeOpacity={0.7}>
                  <Ionicons name={getStarIcon(star)} size={32} color={rating >= star - 0.5 ? "#FFD700" : theme.icon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Note Section */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>备注信息</Text>
            <TextInput style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} value={note} onChangeText={setNote} placeholder="添加备注..." placeholderTextColor={theme.icon} multiline numberOfLines={4} textAlignVertical="top" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
    opacity: 0.8,
  },
  headerRightBtn: {
    padding: 8,
    marginRight: -8,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    fontSize: 17,
    fontWeight: "600",
    marginRight: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  typeText: {
    fontSize: 15,
    fontWeight: "600",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  timeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeRowLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  pickersContainer: {
    flexDirection: "row",
    gap: 8,
  },
  pickerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: 0.5,
  },
  pickerContainer: {
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
});
