import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeMode, useUIStore } from "@/store/uiStore";

export default function GroundScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const { themeMode } = useUIStore();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const SettingItem = ({ icon, label, value, onPress, type = "chevron", isLast = false }: { icon: string; label: string; value?: string; onPress?: () => void; type?: "chevron" | "switch"; isLast?: boolean }) => (
    <TouchableOpacity style={[styles.settingItem, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]} onPress={onPress} disabled={type === "switch"} activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.tint + "15" }]}>
          <MaterialCommunityIcons name={icon as any} size={22} color={theme.tint} />
        </View>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: theme.icon }]}>{value}</Text>}
        {type === "chevron" && <MaterialCommunityIcons name="chevron-right" size={20} color={theme.icon} />}
        {type === "switch" && (
          <Switch
            trackColor={{ false: theme.icon + "40", true: theme.tint + "60" }}
            thumbColor={theme.tint}
            ios_backgroundColor={theme.icon + "40"}
            value={false} // Placeholder
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const Section = ({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.icon }]}>{title}</Text>
      <View style={[styles.card, { backgroundColor: theme.card }]}>{children}</View>
      {description && <Text style={[styles.description, { color: theme.icon }]}>{description}</Text>}
    </View>
  );

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case "system":
        return "系统默认";
      case "dark":
        return "深色模式";
      case "light":
        return "浅色模式";
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
      <Section title="安全性">
        <SettingItem icon="fingerprint" label="生物识别验证" type="switch" isLast={true} />
      </Section>
      <Text style={[styles.sectionDescription, { color: theme.icon }]}>开启后，每次进入应用都需要进行身份验证，确保您的飞行数据安全。</Text>

      <Section title="外观">
        <SettingItem icon="palette-outline" label="应用主题" value={getThemeLabel(themeMode)} onPress={() => router.push("/theme-settings")} isLast={true} />
      </Section>

      <Section title="关于">
        <SettingItem icon="information-outline" label="关于 BlackBox" />
        <SettingItem icon="file-document-outline" label="用户协议与隐私政策" onPress={() => router.push("/privacy-policy")} />
        <SettingItem icon="cloud-download-outline" label="检查更新" value="v1.0.0" isLast={true} />
      </Section>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.icon }]}>BlackBox Flight Terminal</Text>
        <Text style={[styles.footerVersion, { color: theme.icon }]}>Version 1.0.0 (Build 20260107)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  sectionDescription: {
    fontSize: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    marginTop: 8,
    marginHorizontal: 16,
    opacity: 0.7,
    lineHeight: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.5,
  },
  footerVersion: {
    fontSize: 11,
    opacity: 0.3,
  },
});
