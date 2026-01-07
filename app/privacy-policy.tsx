import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Storage } from "@/utils/storage";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { showAgree } = useLocalSearchParams<{ showAgree: string }>();
  // showAgree is passed as a string "true" when forced validation is needed
  const isForced = showAgree === "true";

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleAgree = async () => {
    await Storage.set("has_agreed_privacy", true);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={isForced ? ["top", "bottom", "left", "right"] : ["bottom", "left", "right"]}>
      <Stack.Screen
        options={{
          headerShown: !isForced,
          headerTitle: "用户协议与隐私政策",
          headerBackTitle: "返回",
          gestureEnabled: !isForced,
        }}
      />
      <View style={styles.content}>
        {isForced && <Text style={[styles.title, { color: theme.text }]}>服务协议与隐私政策</Text>}

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.text, { color: theme.text }]}>
            欢迎您使用黑匣子！
            {"\n\n"}
            我们非常重视您的隐私保护和个人信息安全。在您使用本服务前，请仔细阅读并了解本《隐私政策》。
            {"\n\n"}
            1. 我们如何收集和使用您的信息
            {"\n"}
            为了向您提供飞行记录服务，我们需要获取您的位置权限（用于记录起飞和降落地点）。我们承诺仅在必要范围内收集信息，并采取严格的安全措施保护您的数据。
            {"\n\n"}
            2. 信息的存储
            {"\n"}
            您的飞行数据将存储在本地数据库中。除您主动分享或备份外，我们不会将您的个人数据上传至任何第三方服务器。
            {"\n\n"}
            3. 您的权利
            {"\n"}
            您可以随时查看、修改或删除您的飞行记录。您也可以在系统设置中随时关闭位置权限，但这将影响自动记录功能的正常使用。
            {"\n\n"}
            4. 协议更新
            {"\n"}
            我们会根据业务发展和法律法规的要求更新本协议。当本政策发生重大变更时，我们会在版本更新时向您提示。
            {"\n\n"}
            请您确认已阅读并同意上述条款，开始使用黑匣子。
          </Text>
        </ScrollView>

        {isForced && (
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={handleAgree} activeOpacity={0.8}>
              <Text style={[styles.buttonText, { color: colorScheme === "dark" ? "#000" : "#fff" }]}>同意并继续</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.8,
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  button: {
    height: 56,
    borderRadius: 28, // Fully rounded
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
