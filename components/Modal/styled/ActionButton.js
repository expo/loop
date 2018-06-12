import React from 'react';
import styled from 'styled-components';
import colors from '../../../colors';

const Text = styled.Text`
  font-family: Overpass Semibold;
  text-align: center;
  align-self: center;
  color: ${colors.primary};
  padding-vertical: 16px;
  font-size: 14px;
`;

const Touchable = styled.TouchableOpacity``;

export default ({ label, onPress }) => (
  <Touchable onPress={onPress}>
    <Text>{label.toUpperCase()}</Text>
  </Touchable>
);
