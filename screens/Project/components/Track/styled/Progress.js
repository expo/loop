import styled from 'styled-components';
import { Dimensions } from 'react-native';

export default styled.View`
  background-color: ${({ color }) => color};
  height: 64px;
  width: ${({ progress }) => Dimensions.get('window').width * (progress / 100)}px;
  border-top-right-radius: ${({ progress }) => (Math.round(progress) >= 100 ? 0 : 64)}px;
  border-bottom-right-radius: ${({ progress }) => (Math.round(progress) >= 100 ? 0 : 64)}px;
`;
