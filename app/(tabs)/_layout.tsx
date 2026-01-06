import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerTintColor: Colors[colorScheme ?? "light"].text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="cockpit/index"
        options={{
          title: "驾驶舱",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="airplane" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="track/index"
        options={{
          title: "航迹",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map-marker-path" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="radar/index"
        options={{
          title: "雷达",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="radar" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ground/index"
        options={{
          title: "地勤",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wrench" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
