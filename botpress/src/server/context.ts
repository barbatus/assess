import * as trpc from '@trpc/server';
import { PrismaClient } from '@prisma/client';

export const prisma: PrismaClient = new PrismaClient();

export const createContext = async () => {
  return {
    prisma,
    query: prisma.question,
    answer: prisma.answer,
    chat: prisma.testChat,
    story: prisma.story,
  };
};
export type Context = trpc.inferAsyncReturnType<typeof createContext>;
