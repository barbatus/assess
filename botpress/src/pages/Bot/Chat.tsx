import { memo, useState, useCallback, useEffect } from 'react';
import { Box, IconButton, styled, IconButtonProps } from '@mui/joy';
import { useHover } from 'react-use';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReportIcon from '@mui/icons-material/Report';

import { Bubble, Composer, Loader } from '~/components/Chat';

import { trpc, Question } from '~/utils/trpc';

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
  const utils = trpc.useContext();
  const result = trpc.chat.evalQuery.useQuery(
    { query: queryId || query, botId },
    {
      staleTime: Infinity,
      onSuccess: (data) => {
        onLoaded?.(data.query);
      },
    },
  );

  const upDown = trpc.chat.upDownAnswer.useMutation({
    onMutate: () => {
      utils.chat.evalQuery.setData({ query: queryId || query, botId }, (prev) =>
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
  });

  const onUp = useCallback(() => {
    if (result.data) {
      upDown.mutate({
        queryId: result.data.query.id,
        answerId: result.data.answer.value.id,
        up: true,
        botId,
      });
    }
  }, [botId, result.data]);

  const answerText = result.data?.answer?.value.text;
  const isUp = Boolean(
    result.data && !result.data.answer.new && result.data.answer.valid,
  );

  const onQuery = useCallback(() => {
    if (result.data) {
      onQuerySelect?.(result.data?.query);
    }
  }, [result.data, onQuerySelect]);

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
      {useHover((isHovered) => (
        <Box display="flex" justifyContent="start" alignItems="center">
          <Bubble sx={{ position: 'relative', mr: 1 }}>
            {result.isFetching ? <Loader /> : answerText}
          </Bubble>
          {result.data && !result.data.answer.valid && (
            <ReportIcon sx={{ color: 'danger.700', mr: 2 }} />
          )}
          {result.data && !result.isFetching && isHovered && (
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
  const utils = trpc.useContext();

  const onNewQuery = useCallback((query: Question) => {
    utils.chat.queries.setData(undefined, (prev) => {
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
