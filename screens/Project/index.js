import React, { Component, Fragment } from 'react';
import { SecureStore, FileSystem, Updates } from 'expo';
import { View, Slider, Image, Alert, ScrollView } from 'react-native';
import { observer, inject } from 'mobx-react';
import { observable, computed } from 'mobx';
import firebase from 'firebase';
import colors from '../../colors';
import assets from '../../assets';
import Tracks from './Tracks';
import AppBar from '../../components/AppBar';
import Modal from '../../components/Modal';
import Track from './components/Track';
import Settings from './components/Settings';
import UploadStems from './components/UploadStems';
import Container from './components/styled/Container';
import ProjectTitle from './components/styled/ProjectTitle';
import HelpText from './components/styled/HelpText';
import Time from './components/styled/Time';
import ProjectManagementButton from './components/styled/ProjectManagementButton';
import PlayRecordButton from './components/styled/PlayRecordButton';

class ProjectEditorScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    showSettingsModal: this.props.appState.currentProject.title === null,
    showUploadModal: false,
    isPlaying: false,
    isRecording: false,
    uploading: false,
    projectConfig: null,
    timesUploadedToFirebase: 0,
  };

  changeStatus = (isRecording, isPlaying) => {
    this.setState({ isRecording, isPlaying });
  };

  get status() {
    if (this.state.isRecording && this.state.isPlaying) {
      return 'recording';
    } else if (!this.state.isRecording && this.state.isPlaying) {
      return 'playback';
    } else {
      return 'inactive';
    }
  }

  uploadToFirebase = async () => {
    const app = firebase.initializeApp(
      this.props.appState.firebaseCredentials,
      `n${this.state.timesUploadedToFirebase}`
    );

    const PROJECT_DIRECTORY =
      FileSystem.documentDirectory + `${this.props.appState.currentProject.title}/`;
    const files = await FileSystem.readDirectoryAsync(PROJECT_DIRECTORY);

    files.forEach(async (file, i) => {
      const fileURI = PROJECT_DIRECTORY + file;
      const { exists } = await FileSystem.getInfoAsync(fileURI);
      if (exists) {
        const response = await fetch(fileURI);
        const blob = await response.blob();
        const ref = app
          .storage()
          .ref()
          .child(`loop/${this.props.appState.currentProject.title}/${file}`);
        const snapshot = await ref.put(blob);
      }
    });
    this.setState(prevState => {
      return {
        timesUploadedToFirebase: prevState.timesUploadedToFirebase + 1,
      };
    });
  };

  render() {
    return (
      <Container>
        <Modal
          visible={this.state.showSettingsModal}
          title="project settings"
          action={{
            label: 'save settings',
            onPress: () => {
              if (this.state.projectConfig.title.trim() === '') {
                Alert.alert('Invalid Settings', 'Each project must be titled.');
              } else {
                this.props.appState.currentProject = {
                  ...this.props.appState.currentProject,
                  ...this.state.projectConfig,
                };

                SecureStore.setItemAsync(
                  'currentProject',
                  this.props.appState.currentProject.title
                ).then(() => {
                  FileSystem.makeDirectoryAsync(
                    FileSystem.documentDirectory + `${this.props.appState.currentProject.title}/`
                  ).then(() => {
                    FileSystem.writeAsStringAsync(
                      FileSystem.documentDirectory +
                        `${this.props.appState.currentProject.title}/archive.json`,
                      JSON.stringify(this.props.appState.currentProject)
                    );
                  });
                });

                this.setState({ showSettingsModal: false });
              }
            },
          }}>
          <Settings
            onSettingsChange={newConfig => {
              this.setState({ projectConfig: newConfig });
            }}
          />
        </Modal>
        <Modal
          visible={this.state.showUploadModal}
          title="upload stems to firebase"
          dismissable
          onDismiss={() => this.setState({ showUploadModal: false })}
          disabled={this.state.uploading}
          action={{
            label: this.state.uploading ? 'upload in progress...' : 'export to firebase archive',
            onPress: () => {
              this.setState({ uploading: true });
              this.uploadToFirebase()
                .then(() => {
                  Alert.alert(
                    'Upload Complete',
                    'Check your firebase console to download your project files!',
                    [],
                    {
                      onDismiss: () => this.setState({ showUploadModal: false, uploading: false }),
                    }
                  );
                })
                .catch(error => {
                  Alert.alert('Upload Error', error.toString(), [], {
                    onDismiss: () => this.setState({ showUploadModal: false, uploading: false }),
                  });
                });
            },
          }}>
          <UploadStems />
        </Modal>
        <AppBar
          textButton={{
            label: 'archives',
            onPress: () => {
              this.setState({ isPlaying: false, isRecording: false });
              this.props.navigation.navigate('Archives');
            },
          }}
          exportButton={{
            show: true,
            onPress: () => {
              if (this.props.appState.isFirebaseEnabled) {
                this.setState({ showUploadModal: true });
              } else {
                this.props.navigation.navigate('Entry');
              }
            },
          }}
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          {!this.state.showSettingsModal && (
            <Fragment>
              <Tracks status={this.status} changeStatus={this.changeStatus} />
            </Fragment>
          )}
        </ScrollView>
        {!this.state.showSettingsModal && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: 24,
                justifyContent: 'space-around',
              }}>
              <ProjectManagementButton
                color={colors.darkPrimary}
                label="create new project"
                disabled={this.status !== 'inactive'}
                onPress={this.props.appState.createProject(() =>
                  this.props.navigation.replace('Project', null, null, Math.random().toString())
                )}
              />
              <ProjectManagementButton
                color={colors.darkSecondary}
                label="delete project"
                disabled={this.status !== 'inactive'}
                onPress={this.props.appState.deleteProject(() => {
                  this.props.navigation.replace('Archives', null, null, Math.random().toString());
                })}
              />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 24 }}>
              <PlayRecordButton
                disabled={this.status !== 'inactive'}
                color={this.status === 'recording' ? colors.darkSecondary : colors.secondary}
                icon={<Image source={assets.images.recordIcon} />}
                onPress={() => {
                  if (this.state.isRecording) {
                    this.setState({ isPlaying: false, isRecording: false });
                  } else {
                    this.setState({ isPlaying: true, isRecording: true });
                  }
                }}
              />
              <PlayRecordButton
                color={colors.primary}
                disabled={this.status === 'recording'}
                icon={
                  <Image
                    source={this.state.isPlaying ? assets.images.pauseIcon : assets.images.playIcon}
                  />
                }
                onPress={() =>
                  this.setState({ isPlaying: !this.state.isPlaying, isRecording: false })
                }
              />
            </View>
          </View>
        )}
      </Container>
    );
  }
}

export default inject('appState')(observer(ProjectEditorScreen));
