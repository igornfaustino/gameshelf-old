import React from 'react';
import { MockedProvider } from '@apollo/react-testing';

// eslint-disable-next-line import/prefer-default-export
export const wrapComponentInApolloProvider = (
  Component: React.FC,
  props: Record<string, never>,
  mocks: []
): React.ReactNode => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Component {...props} />
    </MockedProvider>
  );
};
