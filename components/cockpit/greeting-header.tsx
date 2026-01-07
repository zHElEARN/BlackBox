import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface GreetingHeaderProps {
  now: number;
}

export const GreetingHeader = ({ now }: GreetingHeaderProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const textSecondary = theme.icon;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "夜深了，机长";
    if (hour < 9) return "早上好，机长";
    if (hour < 12) return "上午好，机长";
    if (hour < 14) return "中午好，机长";
    if (hour < 18) return "下午好，机长";
    if (hour < 22) return "晚上好，机长";
    return "夜深了，机长";
  };

  return (
    <View style={styles.header}>
      <Text style={[styles.greeting, { color: theme.text }]}>{getGreeting()}</Text>
      <Text style={[styles.clock, { color: textSecondary }]}>{new Date(now).toLocaleTimeString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginBottom: 40,
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  clock: {
    fontSize: 16,
    fontWeight: "500",
  },
});
