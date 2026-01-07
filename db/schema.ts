import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const flightTracks = sqliteTable("flight_tracks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  takeoffTime: text("takeoff_time").notNull(),
  landingTime: text("landing_time").notNull(),

  // 起飞信息
  takeoffLat: real("takeoff_lat"),
  takeoffLong: real("takeoff_long"),
  takeoffLocation: text("takeoff_location"),

  // 降落信息
  landingLat: real("landing_lat"),
  landingLong: real("landing_long"),
  landingLocation: text("landing_location"),

  // 其他
  landingType: text("landing_type", { enum: ["NORMAL", "FORCED"] }).notNull(),
  note: text("note"),
  flightExperience: integer("flight_experience"),
});

export type FlightTrack = typeof flightTracks.$inferSelect;
export type NewFlightTrack = typeof flightTracks.$inferInsert;
