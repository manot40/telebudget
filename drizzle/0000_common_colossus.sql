CREATE TABLE `tlb_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `tlb_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tlb_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'EXPENSE' NOT NULL,
	`note` text,
	`tag_id` text,
	`chat_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`amount` real NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`tag_id`) REFERENCES `tlb_tags`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user_id`) REFERENCES `tlb_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tlb_users` (
	`id` text PRIMARY KEY NOT NULL,
	`telegram_id` integer NOT NULL,
	`fullname` text NOT NULL,
	`username` text,
	`updated_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_tag` ON `tlb_tags` (`name`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_chat` ON `tlb_transactions` (`chat_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_tele_id` ON `tlb_users` (`telegram_id`);