import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface LongPressButtonProps {
  title: string;
  onLongPress: () => void;
  backgroundColor: string;
  progressColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  duration?: number;
}

export const LongPressButton = ({ title, onLongPress, backgroundColor, progressColor = "rgba(0,0,0,0.2)", textColor = "#fff", style, buttonStyle, textStyle, duration = 3000 }: LongPressButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onLongPress();
        // Reset after success
        // setIsPressed(false); // Optional: keep it pressed until touch up or reset immediately
        resetAnimation();
      }
    });
  };

  const handlePressOut = () => {
    if (isPressed) {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    setIsPressed(false);
    progress.stopAnimation();
    scale.stopAnimation();

    Animated.parallel([
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={({ pressed }) => [styles.container, style]}>
      <Animated.View style={[styles.button, { backgroundColor, transform: [{ scale }] }, buttonStyle]}>
        <View style={styles.content}>
          <Text style={[styles.text, { color: textColor }, textStyle]}>{isPressed ? "保持按住..." : title}</Text>
        </View>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: progressColor,
              width: width,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 64, // fixed height for better touch area
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  content: {
    zIndex: 1,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
