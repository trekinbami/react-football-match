import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../src/js/containers/App';

function setup() {
  const props = {
    chemistry: [90, 100],
    selectedPlayers: [{
      name: 'Sam Pakvis',
      position: 'Verdediger',
      rating: 40
    },
    {
      name: 'Kyle Lowry',
      position: 'Verdediger',
      rating: 55
    }],
    currentTactics: [{
      def: 8,
      name: '5-4-1',
      off: 4
    }, {
      def: 10,
      name: '4-3-3',
      off: 6
    }],
    result: [{
      goals: 1,
      scorers: [{
        minute: 38,
        player: {
          name: 'Iniesta',
          position: 'Middenvelder',
          rating: 92
        }
      }]
    },{
      goals: 0,
      scorers: []
    }]
  }

  const enzymeWrapper = shallow(<App {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('App', () => {
  it('Does it render correct?', () => {
    const { enzymeWrapper } = setup();
    expect(enzymeWrapper.length).toEqual(1);
  });
});
