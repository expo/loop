import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import Overlay from './styled/Overlay';
import Container from './styled/Container';
import Title from './styled/Title';
import ActionButton from './styled/ActionButton';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export default observer(
  class Modal extends Component {
    keyboardIsVisible = observable.box(false);

    componentDidMount() {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
      this.keyboardIsVisible.set(true);
    };

    _keyboardDidHide = () => {
      this.keyboardIsVisible.set(false);
    };

    render() {
      return this.props.visible ? (
        <Overlay
          activeOpacity={0.9}
          disabled={!this.props.dismissable}
          keyboardIsVisible={this.keyboardIsVisible.get()}
          onPress={this.props.onDismiss}>
          <Container>
            <Title>{this.props.title.toUpperCase()}</Title>
            {this.props.children}
            <ActionButton
              label={this.props.action.label}
              disabled={this.props.disabled}
              onPress={this.props.action.onPress}
            />
          </Container>
        </Overlay>
      ) : null;
    }
  }
);
