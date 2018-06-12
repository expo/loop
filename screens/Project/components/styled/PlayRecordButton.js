import React from 'react';
import styled from 'styled-components';

const Touchable = styled.TouchableOpacity`
  width: 50%;
`;

const Base = styled.View`
  width: 100%;
  height: 64px;
  background-color: ${({ color }) => color};
  align-items: center;
  ${({ disabled }) => disabled && 'opacity: 0.4'};
  justify-content: center;
`;

export default ({ color, onPress, icon, disabled }) => (
  <Touchable onPress={onPress} disabled={disabled} activeOpacity={0.8}>
    <Base color={color} disabled={disabled}>
      {icon}
    </Base>
  </Touchable>
);
