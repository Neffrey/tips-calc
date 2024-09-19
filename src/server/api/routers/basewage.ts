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
  findAll: userProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.baseWages.findMany({
      where: eq(baseWages.user, ctx.session.user.id),
    });
  }),
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
          lte(baseWages.date, input.date),
        ),
        orderBy: [desc(baseWages.date)],
      });
      return data ? data : null;
    }),
  create: userProcedure
    .input(
      z.object({
        date: z.date().transform((val) => stripTime(val)),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const nextBaseWage = await ctx.db.query.baseWages.findFirst({
        where: and(
          eq(baseWages.user, ctx.session.user.id),
          gt(baseWages.date, input.date),
        ),
        orderBy: [asc(baseWages.date)],
      });

      const tipParams = () => {
        if (nextBaseWage) {
          return {
            where: and(
              eq(baseWages.user, ctx.session.user.id),
              gte(baseWages.date, input.date),
              lt(baseWages.date, nextBaseWage.date),
            ),
          };
        }
        return {
          where: and(
            eq(baseWages.user, ctx.session.user.id),
            gte(baseWages.date, input.date),
          ),
        };
      };
      const tipData = await ctx.db.query.tips.findMany(tipParams());

      // Update Existing Tips
      await Promise.all(
        tipData.map(async (tip) => {
          if (!tip) return;
          if (tip.baseWage === input.amount) return;

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
        date: input.date,
        amount: input.amount,
      });
    }),

  edit: userProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date().transform((val) => stripTime(val)),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const nextBaseWage = await ctx.db.query.baseWages.findFirst({
        where: and(
          eq(baseWages.user, ctx.session.user.id),
          gt(baseWages.date, input.date),
        ),
        orderBy: [asc(baseWages.date)],
      });

      const tipParams = () => {
        if (nextBaseWage) {
          return {
            where: and(
              eq(baseWages.user, ctx.session.user.id),
              gte(baseWages.date, input.date),
              lt(baseWages.date, nextBaseWage.date),
            ),
          };
        }
        return {
          where: and(
            eq(baseWages.user, ctx.session.user.id),
            gte(baseWages.date, input.date),
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
          date: input?.date ?? undefined,
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
