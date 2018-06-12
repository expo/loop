import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components';

const Text = styled.Text`
  font-family: Overpass Semibold;
  font-size: 16px;
  color: white;
  padding: 0;
  margin: 0;
  border-width: 0;
  ${Platform.OS === 'ios' && 'margin-bottom: -5px'};
`;

const Touchable = styled.TouchableOpacity``;

export default ({ onPress, label }) => (
  <Touchable onPress={onPress}>
    <Text includeFontPadding={false} lineHeight={0}>
      {label.toUpperCase()}
    </Text>
  </Touchable>
);
