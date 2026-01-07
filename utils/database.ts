import { flightTracks, NewFlightTrack } from "@/db/schema";
import migrations from "@/drizzle/migrations";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "blackbox.db";

const expoDb = SQLite.openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb);

export const Database = {
  /**
   * 初始化数据库
   * 使用 Drizzle Migrations 进行数据库迁移
   */
  async init(): Promise<void> {
    try {
      await migrate(db, migrations);
      console.log("[Database] Migrations applied successfully.");
    } catch (error) {
      console.error("[Database] Migration failed:", error);
      throw error;
    }
  },

  /**
   * 添加航迹记录
   */
  async addTrack(track: NewFlightTrack): Promise<number> {
    const result = await db.insert(flightTracks).values(track).returning();
    return result[0].id;
  },

  /**
   * 获取所有航迹记录
   */
  async getTracks() {
    return await db.select().from(flightTracks).orderBy(desc(flightTracks.takeoffTime));
  },

  /**
   * 删除记录
   */
  async deleteTrack(id: number) {
    return await db.delete(flightTracks).where(eq(flightTracks.id, id));
  },

  /**
   * 按 ID 获取单条记录
   */
  async getTrackById(id: number) {
    const results = await db.select().from(flightTracks).where(eq(flightTracks.id, id));
    return results[0] || null;
  },

  /**
   * 更新航迹记录
   */
  async updateTrack(id: number, data: Partial<NewFlightTrack>) {
    return await db.update(flightTracks).set(data).where(eq(flightTracks.id, id));
  },
};
