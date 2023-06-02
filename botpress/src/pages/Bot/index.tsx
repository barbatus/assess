import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/joy';

import { Layout } from '~/app/Layout';

import { trpc, Question } from '~/utils/trpc';

import { List } from '~/components/List';

import { Chat } from './Chat';
import { Header } from './Header';

export default () => {
  const tQueries = trpc.chat.queries.useQuery(undefined, { staleTime: Infinity });
  const [chat, setChat] = useState<Question[]>([]);
  const [botId, setBotId] = useState<string>('9b3c6d4cdf140b81.9d449cc50c01645d');
  const [queryId, setSelectedQueryId] = useState<number | undefined>(undefined);
  const tAnswers = trpc.chat.answers.useQuery({ queryId }, { enabled: !!queryId });
  const { mutate: deleteQuery } = trpc.chat.deleteQuery.useMutation();

  const utils = trpc.useContext();
  const onTest = useCallback(
    (v: string) => {
      let timeouts: number[] = [];
      setChat([]);
      if (tQueries.data) {
        timeouts = tQueries.data.map((query, index) => {
          return window.setTimeout(() => {
            setChat((prev) => prev.concat(query));
          }, 1000 * index);
        });
        setBotId(v);
        tQueries.data.forEach((query) => {
          utils.chat.evalQuery.invalidate({ query: query.id, botId: v });
          utils.chat.evalQuery.invalidate({ query: query.text, botId: v });
        });
      }
      return () => timeouts.forEach(clearTimeout);
    },
    [tQueries],
  );

  const onDelete = useCallback(
    (id: number) => {
      deleteQuery(
        { queryId: id },
        {
          onSuccess: () => {
            utils.chat.queries.setData(undefined, (prev) => {
              if (!prev) return prev;
              return prev.filter((q) => q.id !== id);
            });
          },
        },
      );
    },
    [deleteQuery],
  );

  const queries = useMemo(
    () => (tQueries.data || []).map(({ id, text }) => ({ id, value: text })),
    [tQueries.data],
  );
  const answers = useMemo(
    () => (tAnswers.data || []).map(({ id, text }) => ({ id, value: text })),
    [tAnswers.data],
  );

  return (
    <Layout
      header={<Header versions={['9b3c6d4cdf140b81.9d449cc50c01645d']} onTest={onTest} />}
    >
      <Box display="flex">
        <List
          title="queries"
          items={queries}
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
          items={answers}
          sx={{ borderLeft: '1px solid', borderLeftColor: 'neutral.outlinedBorder' }}
        />
      </Box>
    </Layout>
  );
};
