import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  serial,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enhanced User table for Replit Auth and Profile Management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number"),
  isEmailVerified: varchar("is_email_verified").default("false"),
  isPhoneVerified: varchar("is_phone_verified").default("false"),
  bio: text("bio"),
  jobTitle: varchar("job_title"),
  company: varchar("company"),
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const updateUserProfileSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  phoneNumber: true,
  bio: true,
  jobTitle: true,
  company: true,
  location: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
});

// Analyses table for storing architecture analysis results
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  content: text("content").notNull(),
  analysisMode: varchar("analysis_mode", { length: 50 }).notNull(),
  cloudProvider: varchar("cloud_provider", { length: 50 }).notNull(),
  region: varchar("region", { length: 50 }),
  score: integer("score"),
  categories: jsonb("categories").$type<{
    security: number;
    reliability: number;
    scalability: number;
    performance: number;
    cost: number;
  }>(),
  verdict: text("verdict"),
  issues: jsonb("issues").$type<string[]>(),
  recommendations: jsonb("recommendations").$type<string[]>(),
  detailedAnalysis: text("detailed_analysis"),
  status: varchar("status", { length: 20 }).default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Diagrams table for storing generated architecture diagrams
export const diagrams = pgTable("diagrams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  analysisId: varchar("analysis_id").references(() => analyses.id),
  userId: varchar("user_id").references(() => users.id),
  diagramType: varchar("diagram_type", { length: 50 }).notNull(),
  mermaidCode: text("mermaid_code").notNull(),
  theme: varchar("theme", { length: 20 }).default("default"),
  format: varchar("format", { length: 20 }).default("mermaid"),
  metadata: jsonb("metadata").$type<{
    componentCount: number;
    complexity: string;
    riskHighlights: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assistant conversations table for storing chat history
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  analysisId: varchar("analysis_id").references(() => analyses.id),
  persona: varchar("persona", { length: 20 }).notNull(),
  messages: jsonb("messages").$type<Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>>(),
  context: text("context"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reports table for storing generated reports
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  analysisId: varchar("analysis_id").references(() => analyses.id),
  userId: varchar("user_id").references(() => users.id),
  reportType: varchar("report_type", { length: 20 }).notNull(), // pdf, markdown
  format: varchar("format", { length: 20 }).notNull(), // detailed, summary, executive
  content: text("content"),
  fileUrl: text("file_url"),
  metadata: jsonb("metadata").$type<{
    includeCharts: boolean;
    includeDiagrams: boolean;
    includeRecommendations: boolean;
    branding?: {
      companyName?: string;
      logo?: string;
    };
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cloud connections table for storing cloud provider connections
export const cloudConnections = pgTable("cloud_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  provider: varchar("provider", { length: 20 }).notNull(), // aws, azure, gcp
  connectionName: text("connection_name").notNull(),
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
  metadata: jsonb("metadata").$type<{
    regions: string[];
    services: string[];
    estimatedMonthlyCost: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Additional Zod schemas for new tables
export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiagramSchema = createInsertSchema(diagrams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertCloudConnectionSchema = createInsertSchema(cloudConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports for all tables
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

export type Diagram = typeof diagrams.$inferSelect;
export type InsertDiagram = z.infer<typeof insertDiagramSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type CloudConnection = typeof cloudConnections.$inferSelect;
export type InsertCloudConnection = z.infer<typeof insertCloudConnectionSchema>;
