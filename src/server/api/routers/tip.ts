import "server-only";

// Make sure you can't import this on client
// LIBS
import { TRPCError } from "@trpc/server";
import { and, gte, lt, eq } from "drizzle-orm";
import { z } from "zod";

// UTILS
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import {
  // REPORT_TYPES_ENUM,
  // reports,
  tips,
  // tipsToReports,
} from "~/server/db/schema";
import { getWeekEpochs, getMonthEpochs, getYearEpochs } from "~/lib/time-date";

// import type { Report } from "~/server/db/schema";

export const tipRouter = createTRPCRouter({
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
          lt(tips.date, input.endDate),
        ),
      });
      return data ? data : null;
    }),
  create: userProcedure
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
        // hours: z.number(),
        // amount: z.number(),
        cashDrawerStart: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          }),
        cashDrawerEnd: z.string().refine((val) => !Number.isNaN(Number(val)), {
          message: "Hourly must be a number",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find existing reports
      // const findExistingReports = await ctx.db.query.reports.findMany({
      //   where: and(
      //     eq(reports.user, ctx.session.user.id),
      //     gte(reports.startEpochTime, input.date.getTime()),
      //     lt(reports.endEpochTime, input.date.getTime()),
      //   ),
      // });
      // type CreateReportInput = {
      //   reportType: (typeof REPORT_TYPES_ENUM.enumValues)[number];
      //   startEpochTime: number;
      //   endEpochTime: number;
      //   user: string;
      // };
      // const createReport = async ({
      //   reportType,
      //   startEpochTime,
      //   endEpochTime,
      // }: CreateReportInput) => {
      //   return await ctx.db
      //     .insert(reports)
      //     .values({
      //       user: ctx.session.user.id,
      //       type: reportType,
      //       startEpochTime,
      //       endEpochTime,
      //     })
      //     .returning();
      // };
      // const reportsForTip = REPORT_TYPES_ENUM.enumValues.map(
      //   // match the report type to the existing reports
      //   async (element) => {
      //     const matchingReport = findExistingReports.find(
      //       (report) => report.type === element,
      //     );
      //     let startEpochTime = 0;
      //     let endEpochTime = 0;
      //     if (matchingReport)
      //       return { type: element, report: matchingReport as Report };
      //     // Set Epoch Times for new report
      //     if (element === "WEEK") {
      //       startEpochTime = getWeekEpochs(input.date).startEpochTime;
      //       endEpochTime = getWeekEpochs(input.date).endEpochTime;
      //     } else if (element === "MONTH") {
      //       startEpochTime = getMonthEpochs(input.date).startEpochTime;
      //       endEpochTime = getMonthEpochs(input.date).endEpochTime;
      //     } else if (element === "YEAR") {
      //       startEpochTime = getYearEpochs(input.date).startEpochTime;
      //       endEpochTime = getYearEpochs(input.date).endEpochTime;
      //     }
      //     return {
      //       type: element,
      //       report: await createReport({
      //         user: ctx.session.user.id,
      //         reportType: element,
      //         startEpochTime,
      //         endEpochTime,
      //       }),
      //     };
      //   },
      // );
      // const createReports = async (
      //   input:
      //     | {
      //         user: string;
      //         type: "WEEK" | "MONTH" | "YEAR";
      //         startEpochTime: number;
      //         endEpochTime: number;
      //       }[]
      //     | undefined,
      // ) => {
      //   if (input && input.length > 0) {
      //     return await ctx.db.insert(reports).values(input).returning();
      //   }
      // };
      // const newReports =
      //   newReportsInputs && newReportsInputs.length > 0 && newReportsInputs[0]
      //     ? await createReports(newReportsInputs)
      //     : null;
      // const tipResult = await ctx.db
      //   .insert(tips)
      //   .values({
      //     user: ctx.session.user.id,
      //     date: input.date,
      //     hours: input.hours,
      //     amount: input.amount,
      //     cashDrawerStart: input?.cashDrawerStart
      //       ? input.cashDrawerStart
      //       : null,
      //     cashDrawerEnd: input?.cashDrawerEnd ? input.cashDrawerEnd : null,
      //   })
      //   .returning({ id: tips.id });
      // if(tipResult < REPORT_TYPES_ENUM.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Couldnt create reports" });
      // const joinTipsToReports = () => {
      //   if(tipResult[0]?.id){
      //     const rawr = await reportsForTip;
      //     .forEach(report => {
      //     });
      //       return await ctx.db.insert(tipsToReports).values({
      //         tipId: tipResult[0].id,
      //         reportId: (await report).),
      //       });
      //     }}
      //   return await ctx.db.insert(tipsToReports).values({
      //     tipId: tipResult[0].id,
      //     reportId: tip.report.id,
      //   });
      // });
      // return tipResult;
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
        // hours: z.number(),
        // amount: z.number(),
        cashDrawerStart: z
          .string()
          .refine((val) => !Number.isNaN(Number(val)), {
            message: "Hourly must be a number",
          }),
        cashDrawerEnd: z.string().refine((val) => !Number.isNaN(Number(val)), {
          message: "Hourly must be a number",
        }),
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

// createWithReturn: userProcedure
//   .input(
//     z.object({
//       taskId: z.string().min(1),
//       timeframeCompletion: z.boolean().default(false).optional(),
//     }),
//   )
//   .mutation(async ({ ctx, input }) => {
//     await ctx.db.insert(taskCompletions).values({
//       taskId: input.taskId,
//       userId: ctx.session.user.id,
//       timeframeCompletion: input.timeframeCompletion,
//     });
//     return await ctx.db.query.taskCompletions.findMany({
//       where: eq(taskCompletions.taskId, input.taskId),
//     });
//   }),
// delete: userProcedure
//   .input(
//     z.object({
//       taskId: z.string().min(1),
//     }),
//   )
//   .mutation(async ({ ctx, input }) => {
//     const getLatestCompletion = await ctx.db
//       .select({ id: taskCompletions.id })
//       .from(taskCompletions)
//       .where(eq(taskCompletions.taskId, input.taskId))
//       .orderBy(desc(taskCompletions.createdAt))
//       .limit(1);
//     const latestCompletion = getLatestCompletion.pop();
//     if (!latestCompletion)
//       throw new TRPCError({
//         message: "No completion found",
//         code: "NOT_FOUND",
//       });
//     return await ctx.db
//       .delete(taskCompletions)
//       .where(
//         and(
//           eq(taskCompletions.id, latestCompletion.id),
//           eq(taskCompletions.userId, ctx.session.user.id),
//         ),
//       );
//   }),
