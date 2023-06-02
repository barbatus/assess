import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';

import { Context } from '../context';
import { queryAnswer } from './bot';
import { Answer } from '@prisma/client';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const baseProcedure = t.procedure;

async function getOrCreateQuery(ctx: Context, value: number | string) {
  if (typeof value === 'string') {
    const found = await ctx.query.findUnique({
      where: { text: value },
    });
    return (
      found ||
      (await ctx.query.create({
        data: { text: value },
      }))
    );
  }
  return ctx.query.findUnique({
    where: { id: value },
  });
}

async function getOrCreateAnswer(
  ctx: Context,
  botId: string,
  queryId: number,
  value: string,
): Promise<{ value: Answer; new: boolean; valid: boolean }> {
  const queryStories = await ctx.story.findMany({
    where: { queryId },
    include: { answer: true },
  });

  const story = queryStories.find((story) => story.answer.text === value);
  const botStory = queryStories.find(
    (story) => story.answer.text === value && story.botId === botId,
  );

  // There is already an answer with this value in the database.
  if (story) {
    return { value: story.answer, new: !botStory, valid: true };
  }

  const answer = await ctx.answer.upsert({
    where: { text: value },
    create: { text: value },
    update: {},
  });

  const other = queryStories.filter((story) => story.botId !== botId);
  return { value: answer, new: !story, valid: other.length === 0 };
}

export const chatRouter = router({
  queries: baseProcedure.query(({ ctx }) => {
    return ctx.query.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }),
  deleteQuery: baseProcedure
    .input(
      z.object({
        queryId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.query.delete({
        where: { id: input.queryId },
      });
    }),
  answers: baseProcedure
    .input(
      z.object({
        queryId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stories = await ctx.story.findMany({
        where: { queryId: input.queryId },
        include: { answer: true },
      });
      return stories.map((story) => story.answer);
    }),
  upDownAnswer: baseProcedure
    .input(
      z.object({
        queryId: z.number(),
        answerId: z.number(),
        up: z.boolean(),
        botId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return input.up
        ? ctx.story.upsert({
            where: {
              queryId_answerId_botId: {
                queryId: input.queryId,
                answerId: input.answerId,
                botId: input.botId,
              },
            },
            create: {
              queryId: input.queryId,
              answerId: input.answerId,
              botId: input.botId,
            },
            update: {},
          })
        : ctx.story.delete({
            where: {
              queryId_answerId_botId: {
                queryId: input.queryId,
                answerId: input.answerId,
                botId: input.botId,
              },
            },
          });
    }),
  evalQuery: baseProcedure
    .input(
      z.object({
        query: z.union([z.string(), z.number()]),
        botId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = await getOrCreateQuery(ctx, input.query);
      if (!query) {
        throw new Error('Query not found');
      }
      const answerText = await queryAnswer(input.botId, query.text);
      const answer = await getOrCreateAnswer(ctx, input.botId, query.id, answerText);

      return { query, answer };
    }),
});

export const appRouter = router({
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
