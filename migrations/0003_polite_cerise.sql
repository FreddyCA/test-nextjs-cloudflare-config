CREATE TABLE `invoices` (
	`id` text PRIMARY KEY DEFAULT 'uuid_generate_v4()' NOT NULL,
	`customer_id` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text NOT NULL,
	`date` text NOT NULL
);
