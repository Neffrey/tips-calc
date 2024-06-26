// LIBS
import { and, eq } from "drizzle-orm";
import "server-only"; // Make sure you can't import this on client
import { z } from "zod";

// UTILS
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { profilePictures } from "~/server/db/schema";

export const profilePictureRouter = createTRPCRouter({
  getProfilePictures: userProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.profilePictures.findMany({
      where: eq(profilePictures.user, ctx.session.user.id),
    });
  }),
  create: userProcedure
    .input(
      z.object({
        url: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(profilePictures).values({
        user: ctx.session.user.id,
        url: input.url,
      });
    }),
  delete: userProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(profilePictures)
        .where(
          and(
            eq(profilePictures.id, input.id),
            eq(profilePictures.user, ctx.session.user.id),
          ),
        );
    }),
});
