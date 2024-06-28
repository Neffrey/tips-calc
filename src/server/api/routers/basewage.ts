import "server-only";

// Make sure you can't import this on client
// LIBS
import { and, asc, desc, eq, gt, gte, lt, lte } from "drizzle-orm";
import { z } from "zod";

// UTILS
import { stripTime } from "~/lib/time-date";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { baseWages, tips } from "~/server/db/schema";

export const baseWageRouter = createTRPCRouter({
  findRecentBeforeDate: userProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.baseWages.findFirst({
        where: and(
          eq(baseWages.user, ctx.session.user.id),
          lte(baseWages.startDate, input.date),
        ),
        orderBy: [desc(baseWages.startDate)],
      });
      return data ? data : null;
    }),
  create: userProcedure
    .input(
      z.object({
        startDate: z.date().transform((val) => stripTime(val)),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const nextBaseWage = await ctx.db.query.baseWages.findFirst({
        where: and(
          eq(baseWages.user, ctx.session.user.id),
          gt(baseWages.startDate, input.startDate),
        ),
        orderBy: [asc(baseWages.startDate)],
      });

      const tipParams = () => {
        if (nextBaseWage) {
          return {
            where: and(
              eq(baseWages.user, ctx.session.user.id),
              gte(baseWages.startDate, input.startDate),
              lt(baseWages.startDate, nextBaseWage.startDate),
            ),
          };
        }
        return {
          where: and(
            eq(baseWages.user, ctx.session.user.id),
            gte(baseWages.startDate, input.startDate),
          ),
        };
      };
      const tipData = await ctx.db.query.tips.findMany(tipParams());

      // Update Existing Tips
      await Promise.all(
        tipData.map(async (tip) => {
          if (!tip ?? tip.baseWage === input.amount) return;

          const tipTotal =
            tip.cardTip +
            (tip.cashDrawerEnd ?? 0) -
            (tip.cashDrawerStart ?? 0) +
            input.amount * tip.hours;

          const updateTip = await ctx.db
            .update(tips)
            .set({
              total: tipTotal,
              perHour: tipTotal / tip.hours,
            })
            .where(
              and(eq(tips.user, ctx.session.user.id), eq(tips.date, tip.date)),
            );
          return updateTip;
        }),
      );

      return await ctx.db.insert(baseWages).values({
        user: ctx.session.user.id,
        startDate: input.startDate,
        amount: input.amount,
      });
    }),

  edit: userProcedure
    .input(
      z.object({
        id: z.string(),
        startDate: z.date().transform((val) => stripTime(val)),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const nextBaseWage = await ctx.db.query.baseWages.findFirst({
        where: and(
          eq(baseWages.user, ctx.session.user.id),
          gt(baseWages.startDate, input.startDate),
        ),
        orderBy: [asc(baseWages.startDate)],
      });

      const tipParams = () => {
        if (nextBaseWage) {
          return {
            where: and(
              eq(baseWages.user, ctx.session.user.id),
              gte(baseWages.startDate, input.startDate),
              lt(baseWages.startDate, nextBaseWage.startDate),
            ),
          };
        }
        return {
          where: and(
            eq(baseWages.user, ctx.session.user.id),
            gte(baseWages.startDate, input.startDate),
          ),
        };
      };
      const tipData = await ctx.db.query.tips.findMany(tipParams());

      // Update Existing Tips
      await Promise.all(
        tipData.map(async (tip) => {
          if (!tip ?? tip.baseWage === input.amount) return;

          const tipTotal =
            tip.cardTip +
            (tip.cashDrawerEnd ?? 0) -
            (tip.cashDrawerStart ?? 0) +
            input.amount * tip.hours;

          const updateTip = await ctx.db
            .update(tips)
            .set({
              total: tipTotal,
              perHour: tipTotal / tip.hours,
            })
            .where(
              and(eq(tips.user, ctx.session.user.id), eq(tips.date, tip.date)),
            );
          return updateTip;
        }),
      );

      return await ctx.db
        .update(baseWages)
        .set({
          startDate: input?.startDate ?? undefined,
          amount: input?.amount ?? undefined,
        })
        .where(
          and(
            eq(baseWages.user, ctx.session.user.id),
            eq(baseWages.id, input.id),
          ),
        );
    }),
});
