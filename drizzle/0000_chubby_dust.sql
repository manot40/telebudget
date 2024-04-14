CREATE TABLE `tlb_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL
);
