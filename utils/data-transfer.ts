import { NewFlightTrack } from "@/db/schema";
import { Database } from "@/utils/database";
import * as DocumentPicker from "expo-document-picker";
import { File as ExpoFile, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const FlightDataTransfer = {
  async exportData() {
    try {
      if (!Paths.document.exists) {
        Alert.alert("错误", "无法访问文档目录。");
        return;
      }
      const allTracks = await Database.getTracks();
      const jsonData = JSON.stringify(allTracks, null, 2);
      const filename = `blackbox_backup_${new Date().toISOString().split("T")[0]}.json`;
      const file = new ExpoFile(Paths.document, filename);
      if (!file.exists) {
        file.create();
      }
      file.write(jsonData);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        Alert.alert("不支持分享", "您的设备不支持分享功能。");
      }
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert("导出失败", "导出数据时发生错误。");
    }
  },
  async importData() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const file = new ExpoFile(result.assets[0].uri);
      const fileContent = await file.text();
      let data: any[];
      try {
        data = JSON.parse(fileContent);
      } catch (e) {
        Alert.alert("文件格式错误", "无法解析该文件，请确保是有效的 JSON 文件。");
        return;
      }
      if (!Array.isArray(data)) {
        Alert.alert("数据格式错误", "导入的数据必须是数组格式。");
        return;
      }
      Alert.alert("确认导入", `准备导入 ${data.length} 条记录。这将会把数据添加到现有数据库中。`, [
        { text: "取消", style: "cancel" },
        {
          text: "确定导入",
          onPress: async () => {
            let successCount = 0;
            let failCount = 0;
            data.reverse();
            for (const item of data) {
              try {
                const { id, ...trackData } = item;
                await Database.addTrack(trackData as NewFlightTrack);
                successCount++;
              } catch (e) {
                console.error("Import item failed:", e);
                failCount++;
              }
            }
            Alert.alert("导入完成", `成功导入 ${successCount} 条记录${failCount > 0 ? `，失败 ${failCount} 条` : ""}。`);
          },
        },
      ]);
    } catch (error) {
      console.error("Import failed:", error);
      Alert.alert("导入失败", "导入数据时发生错误。");
    }
  },
};
