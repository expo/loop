import React, { Component } from 'react';
import styled from 'styled-components';
import { Audio, FileSystem } from 'expo';
import { Feather } from '@expo/vector-icons';
import colors from '../../../../colors';
import Container from './styled/Container';
import Background from './styled/Background';
import Progress from './styled/Progress';
import Controls from './styled/Controls';
import Control from './styled/Control';
import Number from './styled/Number';

const genRecordingConfig = config => ({
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: config.sampleRate,
    numberOfChannels: config.numberOfChannels,
    bitRate: config.bitRate,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    sampleRate: config.sampleRate,
    audioQuality: (() => {
      switch (config.audioQuality) {
        case 0:
          return Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW;
        case 0.5:
          return Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM;
        case 1:
          return Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX;
        default:
          return Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX;
      }
    })(),
    numberOfChannels: config.numberOfChannels,
    bitRate: config.bitRate,
  },
});

export default class Track extends Component {
  recording = new Audio.Recording();
  sound = new Audio.Sound();
  canPlaySound = false;
  from = '';
  to = FileSystem.documentDirectory + `${this.props.config.title}/track-${this.props.number}.m4a`;

  state = { durationMillis: 0 };

  onRecordingStatusUpdate = ({ canRecord, isRecording, durationMillis }) => {
    if (durationMillis >= this.props.maxDurationMillis && isRecording) {
      this.props.finishRecording();
    }

    this.setState({ durationMillis });
  };

  onPlaybackStatusUpdate = ({
    durationMillis,
    positionMillis,
    isPlaying,
    isLooping,
    didJustFinish,
  }) => {
    this.props.setPlaybackPosition(positionMillis);
  };

  createSound = () => {
    Audio.Sound.create({ uri: this.to }, {}, this.onPlaybackStatusUpdate).then(
      ({ sound, status }) => {
        this.sound = sound;
        this.setState({ durationMillis: status.durationMillis });
      }
    );
  };

  componentDidMount() {
    FileSystem.getInfoAsync(this.to).then(({ exists }) => {
      if (exists) {
        this.createSound();
      }
    });
  }

  componentWillUnmount() {
    this.recording.getStatusAsync().then(({ canRecord }) => {
      if (canRecord) {
        this.recording.stopAndUnloadAsync().then(() => {});
      }
    });
    this.sound.getStatusAsync().then(({ isLoaded }) => {
      if (isLoaded) {
        this.sound.pauseAsync().then(() => {
          this.sound.setPositionAsync(0).then(() => {});
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const DID_BEGIN_RECORDING_FOCUSED =
      this.props.focused && prevProps.status !== 'recording' && this.props.status === 'recording';
    const DID_BEGIN_RECORDING =
      prevProps.status !== 'recording' && this.props.status === 'recording';
    const DID_STOP_RECORDING_FOCUSED =
      this.props.focused && prevProps.status === 'recording' && this.props.status === 'inactive';
    const DID_STOP_RECORDING = prevProps.status === 'recording' && this.props.status === 'inactive';
    const DID_BEGIN_PLAYBACK = prevProps.status === 'inactive' && this.props.status === 'playback';
    const DID_STOP_PLAYBACK = prevProps.status === 'playback' && this.props.status === 'inactive';
    const WILL_GAIN_FOCUS =
      this.props.focus.willChange && this.props.focus.to === this.props.number;
    const MAY_LOSE_FOCUS = this.props.focus.willChange && this.props.focus.to !== this.props.number;

    if (DID_BEGIN_RECORDING_FOCUSED) {
      this.canPlaySound = false;
      this.recording = new Audio.Recording();
      this.recording.prepareToRecordAsync(genRecordingConfig(this.props.config)).then(() => {
        this.from = this.recording.getURI();
        this.recording.setProgressUpdateInterval(32);
        this.recording.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate);
        this.recording.startAsync().catch(this.props.finishRecording);
      });
    } else if (DID_BEGIN_RECORDING) {
      this.sound.getStatusAsync().then(({ isLoaded }) => {
        if (isLoaded)
          this.sound.setIsLoopingAsync(false).then(() => {
            this.sound.playFromPositionAsync(0).then(() => {});
          });
      });
    } else if (DID_STOP_RECORDING_FOCUSED) {
      this.recording.stopAndUnloadAsync().then(() => {
        FileSystem.moveAsync({ from: this.from, to: this.to }).then(() => {
          this.createSound();
        });
      });
    } else if (DID_STOP_RECORDING) {
      this.sound.getStatusAsync().then(({ isLoaded }) => {
        if (isLoaded) {
          this.sound.pauseAsync().then(() => {
            this.sound.setPositionAsync(0).then(() => {});
          });
        }
      });
    } else if (DID_BEGIN_PLAYBACK) {
      this.sound.getStatusAsync().then(({ isLoaded }) => {
        if (isLoaded)
          this.sound.setIsLoopingAsync(true).then(() => {
            this.sound.playAsync().then(() => {});
          });
      });
    } else if (DID_STOP_PLAYBACK) {
      this.sound.getStatusAsync().then(({ isLoaded }) => {
        if (isLoaded)
          this.sound.pauseAsync().then(() => {
            this.sound.setPositionAsync(0).then(() => {});
          });
      });
    } else if (MAY_LOSE_FOCUS) {
      this.recording.getStatusAsync().then(({ canRecord }) => {
        if (canRecord) {
          this.recording.stopAndUnloadAsync().then(() => {});
        }
      });
    } else if (WILL_GAIN_FOCUS) {
      this.props.shiftFocus();
    }
  }

  render() {
    const progress = Math.round((this.state.durationMillis / this.props.maxDurationMillis) * 100);

    return (
      <Container
        focused={this.props.focused}
        color={this.props.color}
        disabled={this.props.status === 'recording'}
        onPress={this.props.announceFocusChange}
        activeOpacity={0.5}>
        <Background color={this.props.color} />
        <Progress progress={progress} color={this.props.color} />
        <Controls>
          <Control
            onPress={() => {
              this.sound.getStatusAsync().then(({ isLoaded, isMuted }) => {
                if (isLoaded) {
                  this.sound.setIsMutedAsync(!isMuted).then(() => {
                    this.setState({ isMuted: !isMuted });
                  });
                }
              });
            }}
            icon={
              <Feather name={`volume-${this.state.isMuted ? 'x' : '2'}`} color="white" size={18} />
            }
          />
        </Controls>
        <Number>{this.props.number}</Number>
      </Container>
    );
  }
}
