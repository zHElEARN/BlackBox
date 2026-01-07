import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Database } from "@/utils/database";

export default function FlightLogFinishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!id) return;

    setIsSaving(true);
    try {
      // Save as 10-point scale (0-10)
      // 5 stars = 10 points, 4.5 stars = 9 points, etc.
      await Database.updateTrack(Number(id), {
        flightExperience: rating > 0 ? Math.round(rating * 2) : undefined,
        note: note.trim() || undefined,
      });
      router.back();
    } catch (error) {
      console.error("Failed to update flight log:", error);
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  const handleStarPress = (star: number) => {
    // If clicking the current rating, toggle to half star
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
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>飞行结束</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>请完善本次飞行记录</Text>

          {/* Rating Section */}
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
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.icon,
                },
              ]}
              placeholder="记录本次飞行的特殊情况、天气或心情..."
              placeholderTextColor={theme.icon}
              multiline
              textAlignVertical="top"
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={handleSave} disabled={isSaving}>
              {isSaving ? <ActivityIndicator color={colorScheme === "dark" ? "#000" : "#fff"} /> : <Text style={[styles.buttonText, { color: colorScheme === "dark" ? "#000" : "#fff" }]}>保存记录</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={() => router.back()} disabled={isSaving}>
              <Text style={[styles.skipButtonText, { color: theme.icon }]}>暂不填写</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60, // Give some space from top
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 40,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  footer: {
    marginTop: "auto",
    gap: 16,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
  },
});
