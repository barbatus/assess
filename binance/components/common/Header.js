import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 30%;
  width: 100%;
  background-color: #5a88ff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const Name = styled.div`
  color: #eee;
  font-size: 0.75rem;
`;

const Value = styled.div`
  color: whitesmoke;
  font-size: 2rem;
  margin-bottom: 5px;
`;

const Header = ({ name, value }) => {
  return (
    <Wrapper>
      <Value>${value}</Value>
      <Name>{name}</Name>
    </Wrapper>
  );
};

export default Header;
