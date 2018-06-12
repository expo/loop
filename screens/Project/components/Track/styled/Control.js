import React from 'react';
import styled from 'styled-components';

const TrackControlTouchable = styled.TouchableOpacity`
  margin-right: 16px;
`;

export default ({ icon, onPress }) => (
  <TrackControlTouchable onPress={onPress}>{icon}</TrackControlTouchable>
);
