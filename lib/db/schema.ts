import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const encryptedIntakes = pgTable("encrypted_intakes", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  ciphertext: text("ciphertext").notNull(),
  publicKeyId: text("public_key_id").notNull(),
  urgency: text("urgency").notNull(),
  coarseRegion: text("coarse_region"),
  workType: text("work_type"),
  status: text("status").notNull().default("new"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const organizerPublicKeys = pgTable("organizer_public_keys", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  publicKey: text("public_key").notNull(),
  fingerprint: text("fingerprint"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  rotatedAt: timestamp("rotated_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const contentReviews = pgTable("content_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  lastReviewed: date("last_reviewed"),
  reviewer: text("reviewer"),
  reviewStatus: text("review_status").notNull(),
  notes: text("notes"),
});
