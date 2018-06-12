import React, { Component } from 'react';
import styled from 'styled-components';
import { Slider, View } from 'react-native';
import { observable, autorun } from 'mobx';
import colors from '../../../../colors';
import assets from '../../../../assets';
import Input from './styled/Input';
import SuffixedInput from './styled/SuffixedInput';
import Container from './styled/Container';
import FieldLabel from './styled/FieldLabel';
import SliderContainer from './styled/SliderContainer';
import Row from './styled/Row';
import Segment from './Segment';

class Settings extends Component {
  config = observable({
    title: '',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    audioQuality: 1,
  });

  componentDidMount() {
    autorun(() => this.props.onSettingsChange(this.config));
  }

  render() {
    return (
      <Container>
        <Row first>
          <FieldLabel>{'title'.toUpperCase()}:</FieldLabel>
          <Input
            placeholder="Enter Title Here"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            underlineColorAndroid="transparent"
            selectionColor={colors.lightPrimary}
            onChangeText={text => {
              this.config.title = text.trim();
            }}
          />
        </Row>
        <Row>
          <FieldLabel>{'sample rate'.toUpperCase()}:</FieldLabel>
          <SuffixedInput
            suffix="hz"
            placeholder="44100"
            keyboardType="numeric"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            underlineColorAndroid="transparent"
            selectionColor={colors.lightPrimary}
            onChangeText={text => {
              this.config.sampleRate = parseInt(text);
            }}
          />
        </Row>
        <Row>
          <FieldLabel>{'channels'.toUpperCase()}:</FieldLabel>
          <Segment
            options={['1', '2']}
            defaultIndex={1}
            onChange={i => {
              switch (i) {
                case 0:
                  this.config.numberOfChannels = 1;
                  break;
                case 1:
                  this.config.numberOfChannels = 2;
                  break;
                default:
                  break;
              }
            }}
          />
        </Row>
        <Row>
          <FieldLabel>{'bitrate'.toUpperCase()}:</FieldLabel>
          <SuffixedInput
            suffix="hz"
            placeholder="128000"
            keyboardType="numeric"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            underlineColorAndroid="transparent"
            selectionColor={colors.lightPrimary}
            onChangeText={text => {
              this.config.bitRate = parseInt(text);
            }}
          />
        </Row>
        <Row>
          <FieldLabel>{'audio quality'.toUpperCase()}:</FieldLabel>
          <SliderContainer>
            <Slider
              style={{ width: '90%', alignSelf: 'center', marginTop: -8 }}
              thumbTintColor={'white'}
              value={1}
              step={0.5}
              minimumTrackTintColor={'white'}
              thumbImage={assets.images.recordingQualitySliderThumb}
              onSlidingComplete={v => {
                this.config.audioQuality = v;
              }}
            />
          </SliderContainer>
        </Row>
      </Container>
    );
  }
}

export default Settings;
