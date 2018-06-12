import React from 'react';
import styled from 'styled-components';

const Text = styled.Text`
  font-family: Overpass;
  font-size: 12px;
  color: ${({ color }) => color};
`;

const Touchable = styled.TouchableOpacity``;

export default ({ color, onPress, label, disabled }) => (
  <Touchable onPress={onPress} disabled={disabled}>
    <Text color={color}>{label.toUpperCase()}</Text>
  </Touchable>
);
