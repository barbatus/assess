import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/joy';
import { StyledEngineProvider } from '@mui/joy/styles';
import { addSerializer } from '@tanstack/bling/client';

import Routes from './Routes';

addSerializer({
  apply: (req) => req instanceof Request,
  serialize: (value) => '$request',
});

export function App() {
  return (
    <StyledEngineProvider injectFirst>
      <CssVarsProvider>
        <CssBaseline />
        <Routes />
      </CssVarsProvider>
    </StyledEngineProvider>
  );
}
