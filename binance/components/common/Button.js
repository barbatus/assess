import { memo } from 'react';

import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.a`
  border-radius: 100%;
  display: inline-block;
  cursor: pointer;
  line-height: 0;
`;

export const ButtonIcon = memo(({ className, loading, icon, onClick, ...rest }) => (
  <Wrapper className={className} onClick={onClick} {...rest}>
    <FontAwesomeIcon spin={loading} icon={icon} />
  </Wrapper>
));

const StyledButton = styled.button`
   border: 0;
   text-align: center;
   cursor: pointer;
   padding: 10px 25px;
   border-radius: 8px;
   font-size: inherit;

   ${({ fullWidth }) => fullWidth && `
      width: 100%;
    `}

   ${({ circle }) => circle && `
      padding: 0;
      border-radius: 50%;
      height: 45px;
      width: 45px;
      position: absolute;
      line-height: 0;
    `}
`;

export const Circle = memo(({ icon = faPlus, ...props }) => {
  return (
    <Button {...props} circle>
      <ButtonIcon icon={icon} />
    </Button>
  )
});

export const Button = memo(({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  )
});