import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import assets from '../../../../assets';
import Container from './styled/Container';
import FirebaseUploadContainer from './styled/FirebaseUploadContainer';
import FirebaseLogo from './styled/FirebaseLogo';

class ExportStems extends Component {
  render() {
    return (
      <Container>
        {this.props.appState.isFirebaseEnabled && (
          <FirebaseUploadContainer>
            <FirebaseLogo source={assets.images.firebaseLogo} />
          </FirebaseUploadContainer>
        )}
      </Container>
    );
  }
}

export default inject('appState')(observer(ExportStems));
