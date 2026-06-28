CREATE TABLE "books_cache" (
	"olid" varchar(50) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"author" varchar(500) NOT NULL,
	"cover_url" varchar(500),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
