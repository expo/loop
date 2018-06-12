import React from 'react';
import { TouchableOpacity } from 'react-native';
import Text from './styled/ButtonText';

export default ({ label, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{label.toUpperCase()}</Text>
  </TouchableOpacity>
);
