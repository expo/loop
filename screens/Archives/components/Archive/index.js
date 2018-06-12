import React from 'react';
import { TouchableOpacity } from 'react-native';
import Container from './styled/Container';
import Header from './styled/Header';
import Footer from './styled/Footer';
import Row from './styled/Row';

export Spacer from './styled/Spacer';

export default ({ title, sampleRate, numberOfChannels, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Container>
      <Row>
        <Header>{title.toUpperCase()}</Header>
        <Header>{numberOfChannels == 1 ? 'MONO' : 'STEREO'}</Header>
      </Row>
      <Row>
        <Footer>SAMPLE RATE: {sampleRate}HZ</Footer>
      </Row>
    </Container>
  </TouchableOpacity>
);
