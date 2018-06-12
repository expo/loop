import styled from 'styled-components';

export default styled.View`
  height: 80px;
  padding: 8px;
  width: 100%;
  justify-content: space-between;
  background-color: ${({ isFirebase }) =>
    isFirebase ? 'rgba(101,31,255,.2)' : 'rgba(1,0,202,.2)'};
`;
