import React, { Component } from 'react';

export default props => (
  <div>Hallo {props.name}</div>
);

export class Wow extends Component {
  render() {
    return (
      <div>Wow</div>
    );
  }
}
