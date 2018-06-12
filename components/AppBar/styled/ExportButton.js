import React from 'react';
import styled from 'styled-components';
import { Feather } from '@expo/vector-icons';

const Icon = styled.Image`
  height: 20px;
`;

const Touchable = styled.TouchableOpacity`
  padding-left: 24px;
`;

export default ({ onPress }) => (
  <Touchable onPress={onPress}>
    <Feather color="white" size={18} name="share" />
  </Touchable>
);
