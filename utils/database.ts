import { flightTracks, NewFlightTrack } from "@/db/schema";
import migrations from "@/drizzle/migrations";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
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
    // 过滤掉 undefined 的值
    const updateData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

    if (Object.keys(updateData).length === 0) {
      return;
    }

    return await db.update(flightTracks).set(updateData).where(eq(flightTracks.id, id));
  },

  /**
   * 获取最后一次飞行记录
   */
  async getLastFlight() {
    const results = await db.select().from(flightTracks).orderBy(desc(flightTracks.takeoffTime)).limit(1);
    return results[0] || null;
  },

  /**
   * 获取飞行统计数据
   */
  async getFlightStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 下个月第一天，用于查询当月结束
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfNextMonth = nextMonth.toISOString();

    // 明天，用于查询当天结束
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const startOfTomorrow = tomorrow.toISOString();

    const todayCount = await db.$count(flightTracks, and(gte(flightTracks.takeoffTime, startOfToday), lt(flightTracks.takeoffTime, startOfTomorrow)));

    const monthCount = await db.$count(flightTracks, and(gte(flightTracks.takeoffTime, startOfMonth), lt(flightTracks.takeoffTime, startOfNextMonth)));

    return {
      today: todayCount,
      month: monthCount,
    };
  },

  /**
   * 获取雷达页面所需的汇总数据
   */
  async getRadarStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfNextMonth = nextMonth.toISOString();

    // 1. 获取总统计数据：总次数和总时长
    // 使用 strftime 计算秒数差值
    const totalStatsRes = await db
      .select({
        count: sql<number>`count(*)`,
        duration: sql<number>`sum(strftime('%s', ${flightTracks.landingTime}) - strftime('%s', ${flightTracks.takeoffTime}))`,
      })
      .from(flightTracks);

    const totalMissions = totalStatsRes[0]?.count ?? 0;
    const totalDurationSeconds = totalStatsRes[0]?.duration ?? 0;

    // 2. 获取本月飞行频次
    const monthlyStatsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(flightTracks)
      .where(and(gte(flightTracks.takeoffTime, startOfMonth), lt(flightTracks.takeoffTime, startOfNextMonth)));

    const monthlySorties = monthlyStatsRes[0]?.count ?? 0;

    const totalFlightHours = totalDurationSeconds / 3600;
    const avgDurationSeconds = totalMissions > 0 ? totalDurationSeconds / totalMissions : 0;

    // 3. 按小时分布 (0-23)
    const hourlyRes = await db
      .select({
        hour: sql<string>`strftime('%H', ${flightTracks.takeoffTime}, 'localtime')`,
        count: sql<number>`count(*)`,
      })
      .from(flightTracks)
      .groupBy(sql`strftime('%H', ${flightTracks.takeoffTime}, 'localtime')`);

    const hourlyDistribution = new Array(24).fill(0);
    hourlyRes.forEach((item) => {
      const h = parseInt(item.hour, 10);
      if (!isNaN(h)) hourlyDistribution[h] = item.count;
    });

    // 4. 按周分布 (0-6, 0=Sunday)
    const weeklyRes = await db
      .select({
        day: sql<string>`strftime('%w', ${flightTracks.takeoffTime}, 'localtime')`,
        count: sql<number>`count(*)`,
      })
      .from(flightTracks)
      .groupBy(sql`strftime('%w', ${flightTracks.takeoffTime}, 'localtime')`);

    const weeklyDistribution = new Array(7).fill(0);
    weeklyRes.forEach((item) => {
      const d = parseInt(item.day, 10);
      if (!isNaN(d)) weeklyDistribution[d] = item.count;
    });

    // 5. 最近10次飞行体验评分 (flightExperience)
    const recentExperienceRes = await db
      .select({
        experience: flightTracks.flightExperience,
      })
      .from(flightTracks)
      .orderBy(desc(flightTracks.takeoffTime))
      .limit(10);

    const recentExperience = recentExperienceRes
      .map((r) => r.experience)
      .filter((e): e is number => e !== null) // 只要非 null 的
      .reverse(); // 翻转为按时间正序 (旧 -> 新)

    // 6. 降落状态占比
    const landingStatsRes = await db
      .select({
        type: flightTracks.landingType,
        count: sql<number>`count(*)`,
      })
      .from(flightTracks)
      .groupBy(flightTracks.landingType);

    let normalLandings = 0;
    let forcedLandings = 0;

    landingStatsRes.forEach((item) => {
      if (item.type === "NORMAL") normalLandings = item.count;
      if (item.type === "FORCED") forcedLandings = item.count;
    });

    // 7. 体验均值
    const avgExpRes = await db
      .select({
        avg: sql<number>`avg(${flightTracks.flightExperience})`,
      })
      .from(flightTracks);

    const avgExperience = avgExpRes[0]?.avg ?? 0;

    // 8. 空间与地理轨迹 (Spatial Distribution)
    const locationRes = await db
      .select({
        takeoff: flightTracks.takeoffLocation,
        landing: flightTracks.landingLocation,
      })
      .from(flightTracks);

    const locationCounts: Record<string, number> = {};
    const uniqueLocations = new Set<string>();

    const processLoc = (locJson: string | null) => {
      if (!locJson) return null;
      try {
        const parsed = JSON.parse(locJson);
        // 优先提取: 城市 > 区/县 > 具体地点 > 完整地址
        let name = "";
        if (parsed.city) {
          name = parsed.city;
          // if (parsed.district) name += " " + parsed.district; // 保持简洁，只看城市？或者城市+区
        } else if (parsed.district) {
          name = parsed.district;
        } else if (parsed.name) {
          name = parsed.name;
        } else if (parsed.address) {
          name = parsed.address;
        }

        // 如果是类似 "Point 123" 这种无意义的名字，可能需要过滤，这里暂且保留
        return name ? name.trim() : null;
      } catch (e) {
        // 非 JSON 格式，直接使用字符串
        return locJson.trim() || null;
      }
    };

    locationRes.forEach((row) => {
      const tLoc = processLoc(row.takeoff);
      const lLoc = processLoc(row.landing);

      if (tLoc) {
        locationCounts[tLoc] = (locationCounts[tLoc] || 0) + 1;
        uniqueLocations.add(tLoc);
      }
      if (lLoc) {
        uniqueLocations.add(lLoc);
      }
    });

    const topLocations = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Take top 5

    const geoDiversity = uniqueLocations.size;

    return {
      totalFlightHours: totalFlightHours,
      totalMissions: totalMissions,
      monthlySorties: monthlySorties,
      avgDurationMinutes: avgDurationSeconds / 60,
      hourlyDistribution,
      weeklyDistribution,
      recentExperience,
      landingStats: {
        normal: normalLandings,
        forced: forcedLandings,
      },
      avgExperience,
      topLocations,
      geoDiversity,
    };
  },

  /**
   * 清空所有数据
   */
  async clearAllTracks() {
    return await db.delete(flightTracks);
  },
};
