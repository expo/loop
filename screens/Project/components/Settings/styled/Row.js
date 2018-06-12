import styled from 'styled-components';

export default styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-top: ${({ first }) => (first ? 0 : 16)}px;
`;
