import React from 'react';
import Container from './styled/Container';
import Logo from './styled/Logo';
import assets from '../../assets';
import ButtonsContainer from './styled/ButtonsContainer';
import TextButton from './styled/TextButton';
import ExportButton from './styled/ExportButton';

export default ({ textButton, exportButton }) => (
  <Container>
    <Logo source={assets.images.loopIconHorizontal} />
    <ButtonsContainer>
      <TextButton label={textButton.label} onPress={textButton.onPress} />
      {exportButton.show ? <ExportButton onPress={exportButton.onPress} /> : null}
    </ButtonsContainer>
  </Container>
);
