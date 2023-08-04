import { ReactNode } from 'react';
import { Sheet, styled, Box } from '@mui/joy';

const Container = styled(Sheet)`
  display: grid;
  grid-template-columns: 25% 1fr 25%;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
`;

const Header = styled('header')`
  grid-column: 1 / span 3;
  height: 64px;
`;

export const Layout = (props: { children: ReactNode; header?: ReactNode }) => {
  return (
    <Container variant="outlined">
      <Header
        sx={{
          p: 1,
          borderBottom: '1px solid',
          borderBottomColor: 'neutral.outlinedBorder',
        }}
      >
        {props.header}
      </Header>
      {props.children}
    </Container>
  );
};
