
import { memo } from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  width: 400px;
  height: 600px;
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 8px;
`;

const Layout = memo(({ children }) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
});

export default Layout;
