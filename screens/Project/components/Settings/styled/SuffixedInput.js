import React from 'react';
import styled from 'styled-components';
import { Platform } from 'react-native';
import Input from './Input';

const Container = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const Suffix = styled.Text`
  height: 28px;
  text-align: right;
  color: #fff;
  font-family: Overpass;
  font-size: 18px;
  margin-left: 2px;
  margin-bottom: ${Platform.OS === 'ios' ? -4 : 0}px;
`;

export default props => (
  <Container>
    <Input {...props} />
    <Suffix includeFontPadding={false}>{props.suffix}</Suffix>
  </Container>
);
