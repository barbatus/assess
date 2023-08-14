import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/joy';
import { StyledEngineProvider } from '@mui/joy/styles';
import Routes from './Routes';

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
