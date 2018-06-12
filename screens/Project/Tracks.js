import React, { Component } from 'react';
import { View, Slider, Alert } from 'react-native';
import { observer, inject } from 'mobx-react';
import colors from '../../colors';
import assets from '../../assets';
import Track from './components/Track';
import ProjectTitle from './components/styled/ProjectTitle';
import HelpText from './components/styled/HelpText';
import Time from './components/styled/Time';

const CLIP_DURATION_MILLIS = (seconds => seconds * 1000)(15);

class Tracks extends Component {
  state = {
    playbackPosition: 0,
    focusedTrack: 1,
    focus: { willChange: false, to: 1 },
  };

  render() {
    const playbackProgressInSeconds = Math.round(this.state.playbackPosition / 1000);
    const maximumLengthInSeconds = CLIP_DURATION_MILLIS / 1000;

    const tracks = [
      colors.lighterPrimary,
      colors.lightPrimary,
      colors.primary,
      colors.darkPrimary,
    ].map((color, i) => (
      <Track
        key={i + 1}
        config={this.props.appState.currentProject}
        color={color}
        maxDurationMillis={CLIP_DURATION_MILLIS}
        setPlaybackPosition={ms => {
          this.setState({ playbackPosition: ms });
        }}
        number={i + 1}
        focused={this.state.focusedTrack == i + 1}
        shiftFocus={() => this.setState({ focusedTrack: i + 1, focus: { willChange: false } })}
        announceFocusChange={() => {
          this.setState({ focus: { willChange: true, to: i + 1 } });
        }}
        focus={this.state.focus}
        status={this.props.status}
        finishRecording={() => {
          this.props.changeStatus(false, false);
        }}
      />
    ));

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ProjectTitle>{this.props.appState.currentProject.title}</ProjectTitle>
        <HelpText>
          {`Track ${this.state.focusedTrack} is focused and ready to Record`.toUpperCase()}
        </HelpText>
        {tracks}
        <Slider
          disabled
          maximumValue={CLIP_DURATION_MILLIS}
          value={this.state.playbackPosition}
          style={{ width: '90%', alignSelf: 'center' }}
          thumbTintColor={colors.darkerPrimary}
          minimumTrackTintColor={colors.darkerPrimary}
          thumbImage={assets.images.trackSliderThumb}
        />
        <Time>
          00:{playbackProgressInSeconds < 10
            ? `0${playbackProgressInSeconds}`
            : playbackProgressInSeconds}/00:{maximumLengthInSeconds < 10
            ? `0${maximumLengthInSeconds}`
            : maximumLengthInSeconds}
        </Time>
      </View>
    );
  }
}

export default inject('appState')(observer(Tracks));
