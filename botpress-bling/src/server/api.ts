import axios from 'axios';
import qs from 'qs';

import { type Answer } from '@prisma/client';

import { prisma } from './db.secret$';

axios.defaults.baseURL = 'https://api.openbook.botpress.cloud/v1';

axios.defaults.paramsSerializer = {
  serialize: (params) => {
    return qs.stringify(params, { indices: false });
  },
};

axios.defaults.headers.common['Authorization'] =
  'bearer 0pC7pOtVweWHRBKGnQhuO-0ZKk2ECGwFQKMhHa-upH4.spOB9okvwVQ9_9CmERl_nqdCjFGvFUFl-HhUPxFLQ7E';

export const queryAnswer = async (artifactId: string, query: string) => {
  const { data } = await axios.post<{ result: { answer: string } }>(
    `artifacts/${artifactId}/query`,
    {
      query,
      history: [],
      answer_level: 'strict',
    },
  );
  return data.result.answer;
};

async function getOrCreateQuery(value: number | string) {
  if (typeof value === 'string') {
    const found = await prisma.question.findUnique({
      where: { text: value },
    });
    return (
      found ||
      (await prisma.question.create({
        data: { text: value },
      }))
    );
  }
  return prisma.question.findUnique({
    where: { id: value },
  });
}

async function getOrCreateAnswer(
  botId: string,
  queryId: number,
  value: string,
): Promise<{ value: Answer; new: boolean; valid: boolean }> {
  const queryStories = await prisma.story.findMany({
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

  const answer = await prisma.answer.upsert({
    where: { text: value },
    create: { text: value },
    update: {},
  });

  const other = queryStories.filter((story) => story.botId !== botId);
  return { value: answer, new: !story, valid: other.length === 0 };
}

export async function evalQuery(botId: string, value: string | number) {
  const query = await getOrCreateQuery(value);
  if (!query) {
    throw new Error('Query not found');
  }
  const answerText = await queryAnswer(botId, query.text);
  const answer = await getOrCreateAnswer(botId, query.id, answerText);

  return { query, answer };
}

export async function upDownAnswer(input: {
  up: boolean;
  queryId: number;
  answerId: number;
  botId: string;
}) {
  return input.up
    ? prisma.story.upsert({
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
    : prisma.story.delete({
        where: {
          queryId_answerId_botId: {
            queryId: input.queryId,
            answerId: input.answerId,
            botId: input.botId,
          },
        },
      });
}
