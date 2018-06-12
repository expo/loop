import styled from 'styled-components';
import colors from '../../../../../../colors';

export default styled.Text`
  font-family: Overpass;
  margin-horizontal: 16px;
  padding: 0;
  margin-top: 4px;
  font-size: 18px;
  color: ${({ selected }) => (selected ? colors.darkPrimary : 'white')};
`;
