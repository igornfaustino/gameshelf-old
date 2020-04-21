import React from 'react';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import useRouteQuery from '../hooks/useQuery';

const SEARCH_GAME = gql`
  query searchGames(
    $search: String!
    $platforms: [Int]
    $genres: [Int]
    $limit: Int
    $offset: Int
  ) {
    searchGames(
      search: $search
      platforms: $platforms
      genres: $genres
      limit: $limit
      offset: $offset
    ) {
      id
      name
      coverURL
      genres {
        id
        name
      }
      platforms {
        id
        name
      }
      similarGames
    }
  }
`;

interface Platform {
  id: string;
  name: string;
  abbreviation?: string;
}

interface Genres {
  id: string;
  name: string;
}

interface Game {
  id: string;
  name: string;
  coverURL?: string;
  genresId?: number[];
  genres?: Genres[];
  platforms?: Platform[];
  platformsId?: number[];
  similarGames?: number[];
}

interface Query {
  searchGames: Game[];
}

function Search() {
  const query = useRouteQuery();
  const { loading, error, data } = useQuery<Query>(SEARCH_GAME, {
    variables: { search: query.get('q') },
    skip: !query.get('q'),
  });

  if (!query.get('q')) return <div>Sem query</div>;

  console.log(data);

  return <div className="site-layout-content">{query.get('q')}</div>;
}

export default Search;
