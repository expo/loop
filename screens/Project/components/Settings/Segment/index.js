import React, { Component } from 'react';
import colors from '../../../../../colors';
import Row from './styled/Row';
import Container from './styled/Container';
import LeadContainer from './styled/LeadContainer';
import EndContainer from './styled/EndContainer';
import Label from './styled/Label';

export default class SegmentControl extends Component {
  state = {
    selected: this.props.defaultIndex || 0,
  };

  render() {
    return (
      <Row>
        {this.props.options.map((o, i) => {
          if (i == 0) {
            return (
              <LeadContainer
                key={i}
                selected={this.state.selected == i}
                onPress={() => {
                  this.setState({ selected: i });
                  this.props.onChange(i);
                }}>
                <Label selected={this.state.selected == i}>{o.toUpperCase()}</Label>
              </LeadContainer>
            );
          }
          if (i == this.props.options.length - 1) {
            return (
              <EndContainer
                key={i}
                selected={this.state.selected == i}
                onPress={() => {
                  this.setState({ selected: i });
                  this.props.onChange(i);
                }}>
                <Label selected={this.state.selected == i}>{o.toUpperCase()}</Label>
              </EndContainer>
            );
          }
          return (
            <Container
              key={i}
              selected={this.state.selected == i}
              onPress={() => {
                this.setState({ selected: i });
                this.props.onChange(i);
              }}>
              <Label selected={this.state.selected == i}>{o.toUpperCase()}</Label>
            </Container>
          );
        })}
      </Row>
    );
  }
}
