import React from 'react';
import { render } from '@testing-library/react';

import Loading from '../components/Loading';

describe('Loading component', () => {
  test('Loading render', () => {
    const { asFragment } = render(<Loading />);
    expect(asFragment()).toMatchSnapshot();
  });
});
