import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Storage } from "@/utils/storage";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { showAgree } = useLocalSearchParams<{ showAgree: string }>();
  // showAgree is passed as a string "true" when forced validation is needed
  const isForced = showAgree === "true";
  const insets = useSafeAreaInsets();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleAgree = async () => {
    await Storage.set("has_agreed_privacy", true);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={isForced ? ["top", "bottom", "left", "right"] : ["left", "right"]}>
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

        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: isForced ? 20 : insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
          <View>
            <Text style={[styles.text, { color: theme.text }]}>
              <Text style={styles.bold}>最近更新日期：2026年02月10日{"\n"}</Text>
              <Text style={styles.bold}>生效日期：2026年02月10日{"\n\n"}</Text>
              欢迎您使用黑匣子（以下简称“我们”）。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全。
              {"\n\n"}
              请在使用我们的产品前，仔细阅读并了解本《隐私政策》。
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>一、 我们如何收集和使用您的个人信息</Text>
            <Text style={[styles.text, { color: theme.text }]}>
              为了向您提供飞行记录及地图展示服务，我们需要收集您的以下信息：
              {"\n"}
              1. <Text style={styles.bold}>位置信息</Text>：用于记录起飞和降落地点。
              {"\n"}
              2. <Text style={styles.bold}>设备信息</Text>：用于识别设备唯一性，保障服务稳定运行。
              {"\n\n"}
              我们承诺仅在必要范围内收集信息。您可以随时在系统设置中关闭位置权限，但这将导致记录功能无法使用。
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>二、 第三方服务插件（SDK）说明</Text>
            <Text style={[styles.text, { color: theme.text }]}>
              为了实现高德地图定位及地图展示功能，我们的 App 中集成了 <Text style={styles.bold}>高德地图 SDK</Text>。在您使用相关功能时，该第三方服务商将收集您的相关个人信息。
            </Text>

            <View style={[styles.sdkCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.sdkTitle, { color: theme.text }]}>高德地图 SDK</Text>

              <View style={styles.sdkRow}>
                <Text style={[styles.sdkLabel, { color: theme.text }]}>服务商:</Text>
                <Text style={[styles.sdkValue, { color: theme.text }]}>高德软件有限公司</Text>
              </View>

              <View style={styles.sdkRow}>
                <Text style={[styles.sdkLabel, { color: theme.text }]}>使用目的:</Text>
                <Text style={[styles.sdkValue, { color: theme.text }]}>提供地图展示、定位及路径规划服务</Text>
              </View>

              <View style={styles.sdkRow}>
                <Text style={[styles.sdkLabel, { color: theme.text }]}>收集信息:</Text>
                <Text style={[styles.sdkValue, { color: theme.text }]}>位置信息（经纬度、精确位置、粗略位置）【通过IP地址、GNSS信息、WiFi状态、WiFi参数、WiFi列表、基站信息、信号强度的信息、蓝牙信息、传感器信息（矢量、加速度、压力）、设备信号强度信息获取】、设备标识信息（IDFA、IDFV、MAC地址）、当前应用信息（应用名、应用版本号）、设备参数及系统信息（系统属性、设备型号、操作系统）</Text>
              </View>

              <TouchableOpacity onPress={() => Linking.openURL("https://lbs.amap.com/pages/privacy/")}>
                <Text style={[styles.link, { color: theme.tint }]}>点击查看隐私政策</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>三、 信息的存储与共享</Text>
            <Text style={[styles.text, { color: theme.text }]}>
              1. <Text style={styles.bold}>存储方式</Text>：您的核心飞行数据（如起飞时间、坐标点、备注等）主要存储在您的<Text style={styles.bold}>手机本地数据库</Text>中。
              {"\n"}
              2. <Text style={styles.bold}>数据共享</Text>：除上述第三方 SDK 为实现功能所必须收集的信息外，我们不会将您的个人数据上传至任何第三方服务器，也不会与本公司以外的任何公司、组织和个人分享您的个人信息，除非获得您的明确同意。
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>四、 您的权利</Text>
            <Text style={[styles.text, { color: theme.text }]}>
              按照中国相关的法律法规，我们保障您对自己的个人信息行使以下权利：
              {"\n"}- <Text style={styles.bold}>访问与更正</Text>：您可以随时在 App 内查看、修改您的飞行记录。
              {"\n"}- <Text style={styles.bold}>删除</Text>：您可以随时删除特定的飞行记录或清除 App 全部缓存。
              {"\n"}- <Text style={styles.bold}>撤回授权</Text>：您可以在 iOS 系统设置中随时撤回地理位置、通知等权限。
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>五、 我们如何处理儿童的个人信息</Text>
            <Text style={[styles.text, { color: theme.text }]}>我们的产品主要面向成年人。如果没有父母或监护人的同意，不满 14 周岁的儿童不应创建自己的个人信息。如果我们发现在未获得监护人同意的情况下收集了儿童信息，我们会设法尽快删除。</Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>六、 协议更新</Text>
            <Text style={[styles.text, { color: theme.text }]}>我们会根据业务发展和法律法规的要求更新本协议。当本政策发生重大变更时，我们会在版本更新时通过弹窗或系统通知的方式向您提示。</Text>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>七、 如何联系我们</Text>
            <Text style={[styles.text, { color: theme.text }]}>
              如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式与我们联系：
              {"\n"}- <Text style={styles.bold}>开发者</Text>：Zachary Liu
              {"\n"}- <Text style={styles.bold}>电子邮件</Text>：personal@zhelearn.com
            </Text>
          </View>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  sdkCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  sdkTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sdkRow: {
    marginBottom: 8,
  },
  sdkLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  sdkValue: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  link: {
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
