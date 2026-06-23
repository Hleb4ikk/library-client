CREATE TABLE "reading_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"book_olid" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "reading_list" ADD CONSTRAINT "reading_list_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "reading_list_user_book_unique_idx" ON "reading_list" USING btree ("user_id","book_olid");
