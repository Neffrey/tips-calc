import "server-only"; // Make sure you can't import this on client

// LIBS
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid/non-secure";

// UTILS
import {
  createTRPCRouter,
  protectedUserProcedure,
  userProcedure,
} from "~/server/api/trpc";
import { reports } from "~/server/db/schema";

export const reportRouter = createTRPCRouter({
  getAll: userProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.reports.findMany({
      where: eq(reports.user, ctx.session.user.id),
    });
  }),
  create: protectedUserProcedure
    .input(
      z.object({
        user: z.string().min(1),
        hourly: z.string().refine((val) => !Number.isNaN(Number(val)), {
          message: "Hourly must be a number",
        }),
        total: z.string().refine((val) => !Number.isNaN(Number(val)), {
          message: "Total must be a number",
        }),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(reports).values({
        user: ctx.session.user.id,
        total: input.total,
        hourly: input.hourly,
        startDate: input.startDate,
        endDate: input.endDate,
      });
    }),
  // edit: userProcedure
  //   .input(
  //     z.object({
  //       id: z.string().min(1),
  //       title: z.string().min(1).optional(),
  //       timesToComplete: z.number().int().min(1).optional(),
  //       timeframe: z.enum(TASK_TIMEFRAMES).optional(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.db
  //       .update(reports)
  //       .set({
  //         title: input.title,
  //         userId: ctx.session.user.id,
  //         timesToComplete: input.timesToComplete,
  //         timeframe: input.timeframe,
  //       })
  //       .where(
  //         and(
  //           eq(reports.id, input.id),
  //           eq(reports.userId, ctx.session.user.id),
  //         ),
  //       );
  //   }),
  // delete: userProcedure
  //   .input(z.object({ taskId: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.db
  //       .delete(reports)
  //       .where(
  //         and(
  //           eq(reports.id, input.taskId),
  //           eq(reports.userId, ctx.session.user.id),
  //         ),
  //       );
  //   }),
});
