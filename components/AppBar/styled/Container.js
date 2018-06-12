import styled from 'styled-components';
import { Dimensions, Platform } from 'react-native';
import { Constants } from 'expo';
import colors from '../../../colors';

export default styled.View`
  background-color: ${colors.darkerPrimary};
  padding-top: ${Platform.OS === 'android' ? Constants.statusBarHeight : 0}px;
  width: ${Dimensions.get('window').width}px;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 16px;
  align-items: center;
`;
