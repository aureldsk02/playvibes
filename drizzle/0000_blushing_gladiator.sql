CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text
);
--> statement-breakpoint
CREATE TABLE "playlist_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"playlist_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playlist_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"playlist_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "playlist_likes_playlist_id_user_id_pk" PRIMARY KEY("playlist_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "saved_playlists" (
	"id" text PRIMARY KEY NOT NULL,
	"playlist_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "saved_playlists_playlist_id_user_id_pk" PRIMARY KEY("playlist_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "shared_playlists" (
	"id" text PRIMARY KEY NOT NULL,
	"spotify_playlist_id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"track_count" integer DEFAULT 0,
	"genres" text[],
	"moods" text[],
	"activities" text[],
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "shared_playlists_spotify_playlist_id_unique" UNIQUE("spotify_playlist_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"spotify_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_spotify_id_unique" UNIQUE("spotify_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_comments" ADD CONSTRAINT "playlist_comments_playlist_id_shared_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."shared_playlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_comments" ADD CONSTRAINT "playlist_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_likes" ADD CONSTRAINT "playlist_likes_playlist_id_shared_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."shared_playlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_likes" ADD CONSTRAINT "playlist_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_playlists" ADD CONSTRAINT "saved_playlists_playlist_id_shared_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."shared_playlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_playlists" ADD CONSTRAINT "saved_playlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_playlists" ADD CONSTRAINT "shared_playlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;