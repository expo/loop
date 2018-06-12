import React, { Component } from 'react';
import { ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { observer, inject } from 'mobx-react';
import colors from '../../colors';
import assets from '../../assets';
import Button from './components/Button';
import Container from './components/styled/Container';
import Logo from './components/styled/Logo';
import Input from './components/styled/Input';
import FormInputsContainer from './components/styled/FormInputsContainer';
import HelpText from './components/styled/HelpText';

class EntryScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    willInitFirebase: false,
    initInProgress: false,
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}>
        <Container colors={[colors.primary, colors.darkPrimary]} start={[0, 0]} end={[1, 1]}>
          <Logo source={assets.images.loopIconVertical} resizeMode="contain" />

          <Button
            label="set up firebase storage"
            onPress={() =>
              this.setState(state => ({
                willInitFirebase: !state.willInitFirebase,
              }))
            }
          />

          {this.state.willInitFirebase ? (
            <FormInputsContainer>
              <Input
                placeholder="STORAGE BUCKET"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                underlineColorAndroid="transparent"
                selectionColor={colors.lightPrimary}
                value={this.props.appState.firebaseCredentials.storageBucket || ''}
                onChangeText={text => {
                  this.props.appState.firebaseCredentials.storageBucket = text;
                }}
              />
              <Input
                placeholder="PROJECT ID"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                underlineColorAndroid="transparent"
                selectionColor={colors.lightPrimary}
                value={this.props.appState.firebaseCredentials.projectId || ''}
                onChangeText={text => {
                  this.props.appState.firebaseCredentials.projectId = text;
                }}
              />
              <Input
                placeholder="API KEY"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                underlineColorAndroid="transparent"
                value={this.props.appState.firebaseCredentials.apiKey || ''}
                selectionColor={colors.lightPrimary}
                onChangeText={text => {
                  this.props.appState.firebaseCredentials.apiKey = text;
                }}
              />
            </FormInputsContainer>
          ) : null}
          {this.state.initInProgress ? <ActivityIndicator /> : null}
          {this.state.willInitFirebase ? (
            <Button
              label="initialize"
              onPress={() => {
                this.setState({
                  initInProgress: true,
                });
                this.props.appState.setFirebaseCredentials(
                  () => {
                    this.setState({
                      initInProgress: false,
                    });
                    this.props.navigation.replace('Project');
                  },
                  () =>
                    this.setState({
                      initInProgress: false,
                    })
                );
              }}
            />
          ) : (
            <Button label="skip" onPress={() => this.props.navigation.replace('Project')} />
          )}
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

export default inject('appState')(observer(EntryScreen));
