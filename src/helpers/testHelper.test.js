import React from 'react';
import { render } from '@testing-library/react';
import { useQuery, gql } from '@apollo/client';
import { wrapComponentInApolloProvider } from './testHelpers';

const GET_DOG_QUERY = gql`
  query GetDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Dog({ name }) {
  const { loading, error, data } = useQuery(GET_DOG_QUERY, { variables: { name } });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <p>
      {data.dog.name} is a {data.dog.breed}
    </p>
  );
}

const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: 'Buck',
      },
    },
    result: {
      data: {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' },
      },
    },
  },
];

describe('test helper functions', () => {
  test('functions should wrap component in an apollo provider', async () => {
    const { findByText } = render(wrapComponentInApolloProvider(Dog, { name: 'Buck' }, mocks));
    const loading = await findByText('Loading...');
    expect(loading).toBeTruthy();
    const titleContent = await findByText('Buck is a bulldog');

    expect(titleContent).toBeTruthy();
  });
});
