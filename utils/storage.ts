import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AsyncStorage 封装工具类
 * 提供简单的异步键值对存储功能
 */
export const Storage = {
  /**
   * 保存数据
   * @param key 键
   * @param value 值 (会自动转换为 JSON 字符串)
   */
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(`[AsyncStorage] Error saving key: ${key}`, e);
      throw e;
    }
  },

  /**
   * 读取数据
   * @param key 键
   * @returns 解析后的数据 (T)，如果不存在或解析失败返回 null
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error(`[AsyncStorage] Error reading key: ${key}`, e);
      return null;
    }
  },

  /**
   * 删除指定键的数据
   * @param key 键
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`[AsyncStorage] Error removing key: ${key}`, e);
      throw e;
    }
  },

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error(`[AsyncStorage] Error clearing storage`, e);
      throw e;
    }
  },

  /**
   * 获取所有键
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (e) {
      console.error(`[AsyncStorage] Error getting all keys`, e);
      return [];
    }
  },
};
