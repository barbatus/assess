import { useCallback, useMemo, useState } from 'react';
import { server$, import$ } from '@tanstack/bling';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Box } from '@mui/joy';

import { Layout } from '~/app/Layout';

import { Question } from '@prisma/client';
import { prisma } from '~/server/db.secret$';

import { List } from '~/components/List';

import { Chat } from './Chat';
import { Header } from './Header';

const fn = async (arg: string) => import$<(arg: string) => Promise<string>>(async (arg) => {
  return 'test';
}).then((call) => call(arg));

export default () => {
  const { data: queries } = useQuery(
    ['chat.queries'],
    () =>
      server$(() => {
        return prisma.question.findMany({
          orderBy: {
            order: 'asc',
          },
        });
      })(),
    { staleTime: Infinity, suspense: true },
  );

  const [chat, setChat] = useState<Question[]>([]);
  const [botId, setBotId] = useState<string>('9b3c6d4cdf140b81.9d449cc50c01645d');
  const [queryId, setSelectedQueryId] = useState<number | undefined>(undefined);
  const { data: answers } = useQuery(
    ['chat.answers', queryId],
    () =>
      server$(async (queryId?: number) => {
        const stories = await prisma.story.findMany({
          where: { queryId },
          include: { answer: true },
        });
        return stories.map((story) => story.answer);
      })(queryId),
    { enabled: !!queryId },
  );

  const { mutate: deleteQuery } = useMutation((id: number) => {
    return server$(async (queryId?: number) => {
      await prisma.question.delete({
        where: { id: queryId },
      })
    })(id);
  });

  const client = useQueryClient();
  const onTest = useCallback(
    (v: string) => {
      let timeouts: number[] = [];
      setChat([]);
      if (queries) {
        timeouts = queries.map((query, index) => {
          return window.setTimeout(() => {
            setChat((prev) => prev.concat(query));
          }, 1000 * index);
        });
        setBotId(v);
        queries.forEach((query) => {
          client.invalidateQueries({ queryKey: ['chat.evalQuery', query.id, v] });
          client.invalidateQueries({ queryKey: ['chat.evalQuery', query.text, v] });
        });
      }
      return () => timeouts.forEach(clearTimeout);
    },
    [queries],
  );

  const onDelete = useCallback(
    (id: number) => {
      deleteQuery(
        id,
        {
          onSuccess: () => {
            client.setQueryData(['chat.queries'], (prev?: Question[]) => {
              if (!prev) return prev;
              return prev.filter((q) => q.id !== id);
            });
          },
        },
      );
    },
    [deleteQuery],
  );

  const qItems = useMemo(
    () => (queries || []).map(({ id, text }) => ({ id, value: text })),
    [queries],
  );
  const aItems = useMemo(
    () => (answers || []).map(({ id, text }) => ({ id, value: text })),
    [answers],
  );

  return (
    <Layout
      header={<Header versions={['9b3c6d4cdf140b81.9d449cc50c01645d']} onTest={onTest} />}
    >
      <Box display="flex">
        <List
          title="queries"
          items={qItems}
          sx={{ borderRight: '1px solid', borderRightColor: 'neutral.outlinedBorder' }}
          onDelete={onDelete}
        />
      </Box>
      <Box>
        <Chat
          queries={chat}
          botId={botId}
          onQuerySelect={(query) => setSelectedQueryId(query.id)}
        />
      </Box>
      <Box display="flex">
        <List
          title="answers"
          items={aItems}
          sx={{ borderLeft: '1px solid', borderLeftColor: 'neutral.outlinedBorder' }}
        />
      </Box>
    </Layout>
  );
};
