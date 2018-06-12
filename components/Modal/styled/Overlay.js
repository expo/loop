import styled from 'styled-components';
import { Platform } from 'react-native';
import { Constants } from 'expo';

export default styled.TouchableOpacity`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  flex: 1;
  justify-content: ${({ keyboardIsVisible }) => (keyboardIsVisible ? 'flex-start' : 'center')};
  ${({ keyboardIsVisible }) =>
    keyboardIsVisible &&
    `padding-top: ${(Platform.OS === 'android' ? Constants.statusBarHeight : 0) + 16}px`};
  z-index: 40;
  align-items: center;
`;
