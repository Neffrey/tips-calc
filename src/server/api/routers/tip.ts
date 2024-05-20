import "server-only";

// Make sure you can't import this on client
// LIBS
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

// UTILS
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { tips } from "~/server/db/schema";

export const tipRouter = createTRPCRouter({
  create: userProcedure
    .input(
      z.object({
        date: z.date(),
        hours: z.string().refine((val) => !Number.isNaN(Number(val)), {
          message: "Hourly must be a number",
        }),
        amount: z.string().refine((val) => !Number.isNaN(Number(val)), {
          message: "Hourly must be a number",
        }),
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
      return await ctx.db.insert(tips).values({
        user: ctx.session.user.id,
        date: input.date,
        hours: input.hours,
        amount: input.amount,
        cashDrawerStart: input?.cashDrawerStart ? input.cashDrawerStart : null,
        cashDrawerEnd: input?.cashDrawerEnd ? input.cashDrawerEnd : null,
      });
    }),
  getTip: userProcedure
    .input(
      z.object({
        date: z.date(),
        // date: z.string(),
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
});
