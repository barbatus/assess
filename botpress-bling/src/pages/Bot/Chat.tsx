import { memo, useState, useCallback, useEffect } from 'react';
import * as ReactUse from 'react-use';
import { server$ } from '@tanstack/bling';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, IconButton, styled, IconButtonProps } from '@mui/joy';
import { ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon, Report as  ReportIcon } from '@mui/icons-material';

import { evalQuery, upDownAnswer } from '~/server/api';
import { Bubble, Composer, Loader } from '~/components/Chat';

//import { Question } from '~/server/db.secret$';
import { Question } from '@prisma/client';

const BubbleIcon = styled((props: IconButtonProps) => (
  <IconButton size="sm" variant="plain" {...props} />
))(({ theme }) => ({
  minWidth: '1rem',
  minHeight: '1rem',
  color: theme.palette.neutral[500],
}));

export const Story = ({
  queryId,
  query,
  botId,
  onLoaded,
  onQuerySelect,
}: {
  queryId?: number;
  query: string;
  botId: string;
  onLoaded?: (query: Question) => void;
  onQuerySelect?: (query: Question) => void;
}) => {
  const evalResult = useQuery(
    ['chat.evalQuery', queryId || query, botId],
    () =>
      server$(({ botId, value }) => evalQuery(botId, value))({ botId, value: queryId || query }),
    {
      staleTime: Infinity,
      onSuccess: (data) => {
        onLoaded?.(data.query);
      },
    },
  );

  const client = useQueryClient();

  const upDown = useMutation(
    (input: { queryId: number; answerId: number; up: boolean; botId: string }) => {
      return server$(upDownAnswer)(input);
    },
    {
      onSuccess: () => {
        client.setQueryData(
          ['chat.evalQuery', queryId || query, botId],
          (prev: typeof evalResult.data) =>
            prev
              ? {
                  ...prev,
                  answer: {
                    ...prev.answer,
                    new: false,
                    valid: true,
                  },
                }
              : prev,
        );
      },
    },
  );

  const onUp = useCallback(() => {
    if (evalResult.data) {
      upDown.mutate({
        queryId: evalResult.data.query.id,
        answerId: evalResult.data.answer.value.id,
        up: true,
        botId,
      });
    }
  }, [botId, evalResult.data, upDown]);

  const answerText = evalResult.data?.answer?.value.text;
  const isUp = Boolean(
    evalResult.data && !evalResult.data.answer.new && evalResult.data.answer.valid,
  );

  const onQuery = useCallback(() => {
    if (evalResult.data) {
      onQuerySelect?.(evalResult.data?.query);
    }
  }, [evalResult.data, onQuerySelect]);

  return (
    <Box mb={3}>
      <Box
        display="flex"
        justifyContent="end"
        mb={1}
        sx={{ cursor: 'pointer' }}
        onClick={onQuery}
      >
        <Bubble isQuery>{query}</Bubble>
      </Box>
      {ReactUse.useHover((isHovered) => (
        <Box display="flex" justifyContent="start" alignItems="center">
          <Bubble sx={{ position: 'relative', mr: 1 }}>
            {evalResult.isFetching ? <Loader /> : answerText}
          </Bubble>
          {evalResult.data && !evalResult.data.answer.valid && (
            <ReportIcon sx={{ color: 'danger.700', mr: 2 }} />
          )}
          {evalResult.data && !evalResult.isFetching && isHovered && (
            <>
              <BubbleIcon sx={{ mr: 0.5 }}>
                <ThumbDownIcon />
              </BubbleIcon>
              <BubbleIcon sx={isUp ? { color: 'success.500' } : {}} onClick={onUp}>
                <ThumbUpIcon />
              </BubbleIcon>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

type CharProps = {
  queries: Question[];
  botId: string;
  onQuerySelect?: (query: Question) => void;
};

export const Chat = memo((props: CharProps) => {
  const [newQueries, setQueries] = useState<string[]>([]);
  const client = useQueryClient();

  const onNewQuery = useCallback((query: Question) => {
    client.setQueryData(['chat.queries'], (prev?: Question[]) => {
      if (!prev) return prev;
      return prev.filter((q) => q.id !== query.id).concat(query);
    });
  }, []);

  const onSend = useCallback((query: string) => {
    setQueries((queries) => [...queries, query]);
  }, []);

  useEffect(() => {
    setQueries([]);
  }, [props.queries]);

  console.log(newQueries);

  const stories = props.queries
    .map((query) => (
      <Story
        key={query.id}
        queryId={query.id}
        query={query.text}
        botId={props.botId}
        onQuerySelect={props.onQuerySelect}
      />
    ))
    .concat(
      newQueries.map((query, index) => (
        <Story
          key={query + index}
          query={query}
          botId={props.botId}
          onLoaded={onNewQuery}
          onQuerySelect={props.onQuerySelect}
        />
      )),
    )
    .reverse();
  return (
    <Box
      display="flex"
      p={3}
      flexDirection="column"
      justifyContent="end"
      height="100%"
      sx={{ bgcolor: 'background.level1' }}
    >
      <Box
        display="flex"
        flexDirection="column-reverse"
        flexGrow={1}
        height={0}
        overflow="scroll"
        mr={-3}
        ml={-3}
        pl={3}
        pr={3}
      >
        {stories}
      </Box>
      <Composer onSend={onSend} />
    </Box>
  );
});
