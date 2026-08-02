CREATE TABLE `product_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`product_key` text NOT NULL,
	`brand` text NOT NULL,
	`item` text NOT NULL,
	`issue` text DEFAULT '01' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_alerts_email_product_unique` ON `product_alerts` (`email`,`product_key`);