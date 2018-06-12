import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { FileSystem, Updates } from 'expo';
import AppBar from '../../components/AppBar';
import Archive, { Spacer } from './components/Archive';
import ArchiveLabel from './components/ArchiveLabel';
import { observer, inject } from 'mobx-react';

class ArchivesScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    archives: [],
    isLoadingProject: false,
    isScanningArchives: true,
  };

  componentDidMount() {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(projects => {
      const archives = [];
      if (projects.length === 0) {
        return this.props.navigation.replace('Project', null, null, Math.random().toString());
      }
      projects.forEach((title, i) => {
        const archiveMetadataURI = FileSystem.documentDirectory + `${title}/archive.json`;
        FileSystem.getInfoAsync(archiveMetadataURI).then(({ exists }) => {
          if (exists) {
            FileSystem.readAsStringAsync(archiveMetadataURI).then(archiveMetadataAsString => {
              archives.push(JSON.parse(archiveMetadataAsString));
              if (i === projects.length - 1) {
                this.setState(s => ({
                  archives,
                  isScanningArchives: false,
                }));
              }
            });
          }
        });
      });
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppBar
          textButton={{
            label: 'current project',
            onPress: () => this.props.navigation.pop(),
          }}
          exportButton={{ show: false }}
        />
        <ArchiveLabel>LOCAL ARCHIVE</ArchiveLabel>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          {this.state.archives.map((archive, i) => {
            const onPress = () => {
              this.setState({ isLoadingProject: true });
              this.props.appState.loadProject(archive.title, () => {
                this.setState({ isLoadingProject: false });
                this.props.navigation.replace('Project', null, null, Math.random().toString());
              });
            };

            if (i == this.state.archives.length - 1) {
              return <Archive {...archive} key={i} onPress={onPress} />;
            }
            return (
              <View key={i}>
                <Archive {...archive} key={i} onPress={onPress} />
                <Spacer />
              </View>
            );
          })}
          <Spacer />
          {this.state.isLoadingProject || this.state.isScanningArchives ? (
            <ActivityIndicator size="large" />
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

export default inject('appState')(observer(ArchivesScreen));
