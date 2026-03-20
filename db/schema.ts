import { pgTable, uuid, text, timestamp, numeric, date, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum for claim status
export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "approved",
  "denied",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Claims table
export const claims = pgTable("claims", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  claimNumber: text("claim_number").notNull().unique(),

  service: text("service").notNull(),
  providerName: text("provider_name").notNull(),
  serviceDate: date("service_date").notNull(),

  billedAmount: numeric("billed_amount", { precision: 10, scale: 2 }).notNull(),
  allowedAmount: numeric("allowed_amount", { precision: 10, scale: 2 }),
  insurancePaid: numeric("insurance_paid", { precision: 10, scale: 2 }),
  copayAmount: numeric("copay_amount", { precision: 10, scale: 2 }),
  appliedTowardsDeductible: numeric("applied_towards_deductible", { precision: 10, scale: 2 }),
  coinsuranceAmount: numeric("coinsurance_amount", { precision: 10, scale: 2 }),
  otherAmount: numeric("other_amount", { precision: 10, scale: 2 }),
  otherAmountReason: text("other_amount_reason"),
  patientResponsibility: numeric("patient_responsibility", { precision: 10, scale: 2 }),

  policyNumber: text("policy_number").notNull(),
  insuranceProvider: text("insurance_provider").notNull(),

  status: claimStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Claims notes table
export const claimsNotes = pgTable("claims_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  claimId: uuid("claim_id")
    .notNull()
    .references(() => claims.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  claims: many(claims),
  claimsNotes: many(claimsNotes),
}));

export const claimsRelations = relations(claims, ({ one, many }) => ({
  user: one(users, {
    fields: [claims.userId],
    references: [users.id],
  }),
  claimsNotes: many(claimsNotes),
}));

export const claimsNotesRelations = relations(claimsNotes, ({ one }) => ({
  claim: one(claims, {
    fields: [claimsNotes.claimId],
    references: [claims.id],
  }),
  user: one(users, {
    fields: [claimsNotes.userId],
    references: [users.id],
  }),
}));
