import React from 'react';
import assets from './assets';
import Container from './components/Container';
import { StatusBar, Platform, Alert } from 'react-native';
import colors from './colors';
import { AppLoading, Font, Asset, Permissions } from 'expo';
import { observer, Provider } from 'mobx-react';
import appState from './stores/AppState';
import { createStackNavigator, SafeAreaView } from 'react-navigation';
import Entry from './screens/Entry';
import Project from './screens/Project';
import Archives from './screens/Archives';

const Navigator = createStackNavigator(
  {
    Entry,
    Project,
    Archives,
  },
  {
    initialRouteName: 'Entry',
    headerMode: 'none',
  }
);

class App extends React.Component {
  state = {
    isReady: false,
    hasRecordingPermissions: false,
  };

  startAsync = async () => {
    const images = Object.values(assets.images);

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all([Font.loadAsync(assets.fonts), ...cacheImages]);
    await this.askForPerms();
  };

  askForPerms = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    this.setState({ hasRecordingPermissions: response.status === 'granted' });

    if (!this.state.hasRecordingPermissions) {
      Alert.alert(
        'Recording Permission Error',
        'Please grant recording permissions to use this _recording_ app.',
        [],
        {
          onDismiss: this.askForPerms,
        }
      );
    }
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.startAsync}
          onFinish={() => {
            this.setState({ isReady: true });
          }}
          onError={console.warn}
        />
      );
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          barStyle={Platform.select({
            ios: 'dark-content',
            android: 'light-content',
          })}
          backgroundColor={colors.primary}
        />
        <Container>
          <Provider appState={appState}>
            <Navigator persistenceKey="exponium" />
          </Provider>
        </Container>
      </SafeAreaView>
    );
  }
}

export default observer(App);
