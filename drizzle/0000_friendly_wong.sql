CREATE TABLE `flight_tracks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`takeoff_time` text NOT NULL,
	`landing_time` text NOT NULL,
	`takeoff_lat` real,
	`takeoff_long` real,
	`takeoff_location` text,
	`landing_lat` real,
	`landing_long` real,
	`landing_location` text,
	`landing_type` text NOT NULL,
	`note` text
);
