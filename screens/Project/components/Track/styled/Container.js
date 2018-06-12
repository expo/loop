import styled from 'styled-components';
import colors from '../../../../../colors';

export default styled.TouchableOpacity`
  height: 64px;
  width: 100%;
  flex-direction: row;
  margin-vertical: 6px;
  align-items: center;
  justify-content: space-between;
  ${({ focused }) =>
    focused &&
    `
    shadow-radius: 8px;
    shadow-color: ${colors.darkerPrimary};
    shadow-opacity: 0.95;
    `};
`;
