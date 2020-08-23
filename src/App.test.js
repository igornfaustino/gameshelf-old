import React from 'react';
import { render } from '@testing-library/react';

import App from './App';

describe('App component', () => {
  test('App render', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
