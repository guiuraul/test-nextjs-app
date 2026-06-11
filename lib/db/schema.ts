import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const importStatusEnum = pgEnum("import_status", [
  "queued",
  "processing",
  "completed",
  "failed",
]);

export const genderEnum = pgEnum("insured_gender", ["MALE", "FEMALE"]);

export const portfolios = pgTable("portfolios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  filters: jsonb("filters").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const imports = pgTable("imports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  fileName: text("file_name").notNull(),
  status: importStatusEnum("status").notNull().default("queued"),
  totalRows: integer("total_rows").notNull().default(0),
  processedRows: integer("processed_rows").notNull().default(0),
  failedRows: integer("failed_rows").notNull().default(0),
  errorSummary: text("error_summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const claimRecords = pgTable("claim_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  importId: uuid("import_id").notNull(),
  monthsAsCustomer: integer("months_as_customer").notNull(),
  age: integer("age").notNull(),
  policyNumber: integer("policy_number").notNull(),
  policyBindDate: date("policy_bind_date").notNull(),
  policyState: text("policy_state").notNull(),
  policyCsl: text("policy_csl").notNull(),
  policyDeductable: integer("policy_deductable").notNull(),
  policyAnnualPremium: numeric("policy_annual_premium", { precision: 12, scale: 2 }).notNull(),
  umbrellaLimit: integer("umbrella_limit").notNull(),
  insuredZip: integer("insured_zip").notNull(),
  insuredSex: genderEnum("insured_sex").notNull(),
  insuredEducationLevel: text("insured_education_level").notNull(),
  insuredOccupation: text("insured_occupation").notNull(),
  insuredHobbies: text("insured_hobbies").notNull(),
  insuredRelationship: text("insured_relationship").notNull(),
  capitalGains: integer("capital_gains").notNull(),
  capitalLoss: integer("capital_loss").notNull(),
  incidentDate: date("incident_date").notNull(),
  incidentType: text("incident_type").notNull(),
  collisionType: text("collision_type").notNull(),
  incidentSeverity: text("incident_severity").notNull(),
  authoritiesContacted: text("authorities_contacted").notNull(),
  incidentState: text("incident_state").notNull(),
  incidentCity: text("incident_city").notNull(),
  incidentLocation: text("incident_location").notNull(),
  incidentHourOfTheDay: integer("incident_hour_of_the_day").notNull(),
  numberOfVehiclesInvolved: integer("number_of_vehicles_involved").notNull(),
  propertyDamage: text("property_damage").notNull(),
  bodilyInjuries: integer("bodily_injuries").notNull(),
  witnesses: integer("witnesses").notNull(),
  policeReportAvailable: text("police_report_available").notNull(),
  totalClaimAmount: numeric("total_claim_amount", { precision: 12, scale: 2 }).notNull(),
  injuryClaim: numeric("injury_claim", { precision: 12, scale: 2 }).notNull(),
  propertyClaim: numeric("property_claim", { precision: 12, scale: 2 }).notNull(),
  vehicleClaim: numeric("vehicle_claim", { precision: 12, scale: 2 }).notNull(),
  autoMake: text("auto_make").notNull(),
  autoModel: text("auto_model").notNull(),
  autoYear: integer("auto_year").notNull(),
  fraudReported: boolean("fraud_reported").notNull().default(false),
  isGroup39: boolean("is_group_39").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ClaimRecordInsert = typeof claimRecords.$inferInsert;
export type ClaimRecordSelect = typeof claimRecords.$inferSelect;
export type PortfolioInsert = typeof portfolios.$inferInsert;
export type PortfolioSelect = typeof portfolios.$inferSelect;
export type ImportInsert = typeof imports.$inferInsert;
export type ImportSelect = typeof imports.$inferSelect;
