import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/joy';
import { StyledEngineProvider } from '@mui/joy/styles';
import { addSerializer } from '@tanstack/bling/client';

import Routes from './Routes';

addSerializer({
  apply: (req) => req instanceof Request,
  serialize: (value) => '$request',
});

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <CssVarsProvider>
          <CssBaseline />
          <Routes />
        </CssVarsProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}
