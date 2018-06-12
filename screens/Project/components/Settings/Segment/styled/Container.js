import styled from 'styled-components';

export default styled.TouchableOpacity`
  height: 32px;
  background-color: ${({ selected }) => (selected ? 'white' : 'rgba(255,255,255,0.3)')};
  align-items: center;
  justify-content: center;
`;
