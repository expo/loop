import styled from 'styled-components';

export default styled.View`
  background-color: ${({ color }) => color};
  height: 64px;
  opacity: 0.3;
  width: 100%;

  position: absolute;
  left: 0;
  top: 0;
`;
