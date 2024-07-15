CREATE TABLE `customers` (
	`id` text PRIMARY KEY DEFAULT 'uuid_generate_v4()' NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `revenue` (
	`month` text NOT NULL,
	`revenue` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `revenue_month_unique` ON `revenue` (`month`);