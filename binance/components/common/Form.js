import React from 'react';

import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-conent: flex-start;
  margin-bottom: 10px;
`;

const ErrorMsg = styled.div`
  color: #AB192F;
`;

export const Input = styled(({ value = '', ...props}) =>
    <input {...props} value={value} aria-label={props.name} />
  )`
  width: 100%;
  border-radius: 8px;
  padding: 10px 15px;
  background-color: #F5F5F5;
  height: 40px;
  border: 0;

  &:focus {
    outline: none;
  }
`;

const FormError = styled(ErrorMsg)`
  margin-top: 8px;
`;

export const FormRow = React.memo(({ label, hint, error, children }) => {
  return (
    <Row>
      {children}
    </Row>
  );
});

export const Form =  React.memo(({ error, children, ...props }) => {
  return (
    <form {...props}>
      {children}
      {error && <FormError>{error}</FormError>}
    </form>
  );
});
