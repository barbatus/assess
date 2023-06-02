import { memo, useCallback, useState } from 'react';
import { Textarea, Box, styled, IconButton } from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';

const Dot = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  height: theme.spacing(1),
  width: theme.spacing(1),
  borderRadius: '50%',
  animationDuration: '1.5s',
  animationIterationCount: 'infinite',
  animationName: 'typingDotAnim',
  backgroundColor: theme.palette.text.tertiary,
  opacity: 0.5,
}));

export const Loader = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Dot sx={{ animationDelay: '1s' }} />
      <Dot sx={{ animationDelay: '1.2s' }} />
      <Dot sx={{ animationDelay: '1.4s' }} />
    </Box>
  );
};

export const Bubble = styled('div')<{ isQuery?: boolean }>(({ theme, isQuery }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.palette.neutral.outlinedBorder}`,
  borderBottomRightRadius: isQuery ? 0 : theme.radius.sm,
  borderBottomLeftRadius: isQuery ? theme.radius.sm : 0,
  minWidth: theme.spacing(8),
  maxWidth: '60%',
}));

export const Composer = memo(({ onSend }: { onSend?: (query: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleSend = useCallback(() => {
    onSend?.(query.trim());
    setQuery('');
  }, [query]);

  return (
    <Box display="flex" alignItems="center">
      <Textarea
        minRows={4}
        maxRows={4}
        sx={{ width: '100%', marginRight: 2 }}
        value={query}
        onChange={(e: any) => setQuery(e.target.value)}
      />
      <IconButton onClick={handleSend} size="md">
        <SendIcon />
      </IconButton>
    </Box>
  );
});
