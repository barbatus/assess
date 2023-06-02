import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { BrowserRouter } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { StyledEngineProvider } from '@mui/joy/styles';

import { trpc } from '../utils/trpc';
import Routes from './Routes';

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://localhost:2022',
    }),
  ],
});

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <CssVarsProvider>
            <CssBaseline />
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </CssVarsProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
