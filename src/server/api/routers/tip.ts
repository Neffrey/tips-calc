import "server-only";

// Make sure you can't import this on client
// LIBS
import { and, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

// UTILS
import { stripTime } from "~/lib/time-date";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import {
  // REPORT_TYPES_ENUM,
  // reports,
  tips,
} from "~/server/db/schema";
// import { getWeekEpochs, getMonthEpochs, getYearEpochs } from "~/lib/time-date";

// import type { Report } from "~/server/db/schema";

export const tipRouter = createTRPCRouter({
  findAll: userProcedure
    // .input(
    //   z.object({
    //     date: z.date(),
    //   }),
    // )
    .query(async ({ ctx }) => {
      const data = await ctx.db.query.tips.findMany({
        where: eq(tips.user, ctx.session.user.id),
      });
      return data ? data : null;
    }),
  findSingle: userProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.tips.findFirst({
        where: and(
          eq(tips.user, ctx.session.user.id),
          eq(tips.date, input.date),
        ),
      });
      return data ? data : null;
    }),
  findWithinRange: userProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.tips.findMany({
        where: and(
          eq(tips.user, ctx.session.user.id),
          gte(tips.date, input.startDate),
          lte(tips.date, input.endDate),
        ),
      });
      return data ? data : null;
    }),
  create: userProcedure
    .input(
      z.object({
        date: z.date().transform((val) => stripTime(val)),
        hours: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          })
          .transform((val) => Number(val)),
        amount: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          })
          .transform((val) => Number(val)),
        cashDrawerStart: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Cash drawer start must be a number",
          })
          .transform((val) => Number(val)),
        cashDrawerEnd: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Cash drawer end must be a number",
          })
          .transform((val) => Number(val)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(tips)
        .values({
          user: ctx.session.user.id,
          date: input.date,
          hours: input.hours,
          amount: input.amount,
          cashDrawerStart: input?.cashDrawerStart
            ? input.cashDrawerStart
            : null,
          cashDrawerEnd: input?.cashDrawerEnd ? input.cashDrawerEnd : null,
        })
        .returning();
    }),
  edit: userProcedure
    .input(
      z.object({
        date: z.date(),
        hours: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          })
          .transform((val) => Number(val)),
        amount: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          })
          .transform((val) => Number(val)),
        cashDrawerStart: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          })
          .nullable()
          .transform((val) => (!val ? null : Number(val))),
        cashDrawerEnd: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          })
          .nullable()
          .transform((val) => (!val ? null : Number(val))),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tipResult = await ctx.db
        .update(tips)
        .set({
          hours: input.hours,
          amount: input.amount,
          cashDrawerStart: input?.cashDrawerStart
            ? input.cashDrawerStart
            : null,
          cashDrawerEnd: input?.cashDrawerEnd ? input.cashDrawerEnd : null,
        })
        .where(
          and(eq(tips.user, ctx.session.user.id), eq(tips.date, input.date)),
        )
        .returning();
      return tipResult;
    }),
});
