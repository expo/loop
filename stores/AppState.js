import { decorate, observable, computed, action } from 'mobx';
import { SecureStore, Audio, FileSystem } from 'expo';
import { Alert } from 'react-native';
import firebase from 'firebase';

class AppState {
  constructor() {
    SecureStore.getItemAsync('firebase').then(credentials => {
      if (credentials) this.firebaseCredentials = JSON.parse(credentials);
      SecureStore.getItemAsync('currentProject').then(title => {
        if (title) {
          const archiveMetadataURI = FileSystem.documentDirectory + `${title}/archive.json`;
          FileSystem.getInfoAsync(archiveMetadataURI).then(file => {
            if (file.exists) {
              FileSystem.readAsStringAsync(archiveMetadataURI).then(projectDataAsString => {
                this.currentProject = JSON.parse(projectDataAsString);
              });
            }
          });
        }
      });
    });
  }

  reset = next => {
    this.currentProject = {
      title: null,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      audioQuality: 1,
    };

    SecureStore.getItemAsync('currentProject').then(title => {
      if (title) {
        const archiveMetadataURI = FileSystem.documentDirectory + `${title}/archive.json`;
        FileSystem.getInfoAsync(archiveMetadataURI).then(file => {
          if (file.exists) {
            FileSystem.readAsStringAsync(archiveMetadataURI).then(projectDataAsString => {
              this.currentProject = JSON.parse(projectDataAsString);
              next();
            });
          }
        });
      } else {
        next();
      }
    });
  };

  firebaseCredentials = { storageBucket: null, projectId: null, apiKey: null };
  firebaseLoginAttempts = 0;

  currentProject = {
    title: null,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    audioQuality: 1,
  };

  deleteProject = next => () => {
    Alert.alert('Are You Sure?', 'Deleting this project will destroy its files forever.', [
      { text: 'Cancel', onPress: () => null, style: 'cancel' },
      {
        text: 'OK',
        onPress: () =>
          FileSystem.deleteAsync(
            FileSystem.documentDirectory + `${this.currentProject.title}/`
          ).then(() => {
            SecureStore.deleteItemAsync('currentProject').then(() => {
              this.reset(next);
            });
          }),
      },
    ]);
  };

  createProject = next => () => {
    SecureStore.deleteItemAsync('currentProject').then(() => {
      this.reset(next);
    });
  };

  loadProject = (title, next) => {
    SecureStore.setItemAsync('currentProject', title).then(() => {
      this.reset(next);
    });
  };

  get isFirebaseEnabled() {
    return (
      this.firebaseCredentials.storageBucket !== null &&
      this.firebaseCredentials.projectId !== null &&
      this.firebaseCredentials.apiKey !== null
    );
  }

  setFirebaseCredentials = (success, failure) => {
    const testApp = firebase.initializeApp(
      this.firebaseCredentials,
      `testApp-${this.firebaseLoginAttempts}`
    );

    try {
      testApp
        .storage()
        .ref()
        .child('loop/test/credentialTest.txt')
        .putString('Hi from Expo!')
        .then(() => {
          SecureStore.setItemAsync('firebase', JSON.stringify(this.firebaseCredentials)).then(
            success
          );
        })
        .catch(e => {
          if (e.code_ === 'storage/unknown') {
            Alert.alert(
              'Invalid Credentials',
              "Sorry, we can't find your storage bucket with the credentials provided."
            );
            failure();
          }
        });
    } catch (error) {
      Alert.alert('Invalid Credentials', error.message);
      failure();
    } finally {
      this.firebaseLoginAttempts++;
    }
  };
}

decorate(AppState, {
  firebaseCredentials: observable,
  firebaseLoginAttempts: observable,
  currentProject: observable,
  deleteProject: action,
  reset: action,
  createProject: action,
  isFirebaseEnabled: computed,
  setFirebaseCredentials: action,
});

export default new AppState();
