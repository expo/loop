import styled from 'styled-components';
import { Dimensions } from 'react-native';

export default styled.View`
  background-color: white;
  border-radius: 16px;
  width: ${Dimensions.get('window').width - 64}px;
`;
