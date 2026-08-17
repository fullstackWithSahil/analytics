CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product` integer NOT NULL,
	`productName` text NOT NULL,
	`productType` text NOT NULL,
	`organization` text NOT NULL,
	`expiresAt` text NOT NULL,
	`tier` text NOT NULL,
	`student` text NOT NULL,
	`paymentType` text NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `video_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer,
	`student` text NOT NULL,
	`course_id` integer NOT NULL,
	`lesson_id` integer NOT NULL,
	`video_id` text NOT NULL,
	`session_id` text NOT NULL,
	`organization` text NOT NULL,
	`event` text NOT NULL,
	`current_time` real NOT NULL,
	`duration` real NOT NULL,
	`seek_from` real,
	`seek_to` real,
	`playback_rate` real,
	`volume` integer,
	`muted` integer
);
