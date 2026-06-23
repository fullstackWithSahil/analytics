CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`teacher` text NOT NULL,
	`product` integer NOT NULL,
	`productName` text NOT NULL,
	`productType` text NOT NULL,
	`expiresAt` text NOT NULL,
	`tier` text NOT NULL,
	`student` text NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
