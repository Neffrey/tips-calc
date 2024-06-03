import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgEnum,
  date,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  bigint,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { nanoid } from "nanoid/non-secure";

import type { Prettify, InferSqlTable } from "~/lib/type-utils";

// CONSTS
export const COLOR_THEMES = [
  "bland",
  "bumblebee",
  "coffee",
  "cupcake",
  "forest",
  "galaxy",
  "lavender",
  "valentine",
] as const;
export type ColorTheme = (typeof COLOR_THEMES)[number];

export const ldThemes = ["light", "dark"] as const;
export type LdTheme = (typeof ldThemes)[number];

export const USER_ROLES = ["ADMIN", "USER", "RESTRICTED"] as const;
export type UserRole = (typeof users.role.enumValues)[number];

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `tips_${name}`);

export type DbUser = Prettify<
  InferSqlTable<typeof users> & {
    accounts?: Account[];
    profilePictures?: ProfilePicture[];
    tips?: Tip[];
    reports?: Report[];
    baseWages?: BaseWage[];
  }
>;
export const users = createTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),
    role: text("role", { enum: USER_ROLES }).default(USER_ROLES[1]),
    colorTheme: text("colorTheme", { enum: COLOR_THEMES }).default(
      COLOR_THEMES[5],
    ),
    ldTheme: text("ldTheme", { enum: ldThemes }).default(ldThemes[1]),
  },
  (user) => ({
    userIndex: index("user_id_index").on(user.id),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  profilePictures: many(profilePictures),
  tips: many(tips),
  // reports: many(reports),
  baseWages: many(baseWages),
}));

export type Account = Prettify<InferSqlTable<typeof accounts>>;
export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIndex: index("account_user_index").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIndex: index("session_user_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// CONTENT TABLES

export type ProfilePicture = Prettify<
  InferSqlTable<typeof profilePictures> & {
    user?: DbUser[];
  }
>;
export const profilePictures = createTable(
  "profilePicture",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$default(() => nanoid(12)),
    user: text("user")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (profilePicture) => ({
    userIndex: index("pp_userId_Index").on(profilePicture.user),
    idIndex: index("pp_id_Index").on(profilePicture.id),
  }),
);

export const profilePictureRelations = relations(
  profilePictures,
  ({ one }) => ({
    user: one(users, {
      fields: [profilePictures.user],
      references: [users.id],
    }),
  }),
);

export type BaseWage = Prettify<InferSqlTable<typeof baseWages>>;
export const baseWages = createTable(
  "baseWage",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$default(() => nanoid(12)),
    user: text("user")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: numeric("amount").notNull(),
    startDate: timestamp("startDate", {
      mode: "date",
    }).notNull(),
  },
  (baseWage) => ({
    idIndex: index("wage_id_index").on(baseWage.id),
    userIndex: index("wage_user_index").on(baseWage.user),
    effectiveAtIndex: index("wage_effective_at_index").on(baseWage.startDate),
  }),
);

export const baseWagesRelations = relations(baseWages, ({ one }) => ({
  user: one(users, { fields: [baseWages.user], references: [users.id] }),
}));

export type Tip = Prettify<InferSqlTable<typeof tips>>;
export const tips = createTable(
  "tip",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$default(() => nanoid(12)),
    user: text("user")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date", {
      mode: "date",
    }).notNull(),
    // epoch: bigint("epoch", { mode: "number" }).$type<number>().notNull(),
    hours: numeric("hours").$type<number>().notNull(),
    amount: numeric("amount").$type<number>().notNull(),
    cashDrawerStart: numeric("cashDrawerStart"),
    cashDrawerEnd: numeric("cashDrawerEnd"),
  },
  (tip) => ({
    tipIdIndex: index("tip_id_index").on(tip.id),
    userIndex: index("tip_user_index").on(tip.user),
    epochIndex: index("tip_epoch_index").on(tip.user),
  }),
);

export const tipRelations = relations(tips, ({ one, many }) => ({
  user: one(users, { fields: [tips.user], references: [users.id] }),
  // tipsToReports: many(tipsToReports),
}));

// export const REPORT_TYPES_ENUM = pgEnum("popularity", [
//   "WEEK",
//   "MONTH",
//   "YEAR",
// ]);

// export type Report = Prettify<InferSqlTable<typeof reports>>;
// export const reports = createTable(
//   "report",
//   {
//     id: text("id")
//       .notNull()
//       .primaryKey()
//       .$default(() => nanoid(12)),
//     user: text("user")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     type: REPORT_TYPES_ENUM("type").default(REPORT_TYPES_ENUM.enumValues[0]),
//     // total: numeric("total").notNull(),
//     // hourly: numeric("hourly").notNull(),
//     startEpochTime: numeric("startEpochTime").$type<number>().notNull(),
//     endEpochTime: numeric("endEpochTime").$type<number>().notNull(),
//   },
//   (report) => ({
//     idIndex: index("report_id_index").on(report.id),
//   }),
// );

// export const reportRelations = relations(reports, ({ one, many }) => ({
//   user: one(users, { fields: [reports.user], references: [users.id] }),
//   tipsToReports: many(tipsToReports),
// }));

// export const tipsToReports = createTable(
//   "tipToReport",
//   {
//     tipId: text("tipId").notNull(),
//     reportId: text("reportId").notNull(),
//   },
//   (tipToReport) => ({
//     compoundKey: primaryKey({
//       columns: [tipToReport.tipId, tipToReport.reportId],
//     }),
//   }),
// );

// export const tipsToReportsRelations = relations(tipsToReports, ({ one }) => ({
//   tip: one(tips, { fields: [tipsToReports.tipId], references: [tips.id] }),
//   report: one(reports, {
//     fields: [tipsToReports.reportId],
//     references: [reports.id],
//   }),
// }));
