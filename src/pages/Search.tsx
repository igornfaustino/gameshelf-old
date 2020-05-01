import React, { useMemo, useState, useEffect } from 'react';

import { Button } from 'antd';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import useRouteQuery from '../hooks/useQuery';
import Game from '../components/Game';
import { GameType } from '../types/common';
import styles from './Search.module.scss';
import FilterForm from '../components/FilterForm';

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
      count
      games {
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
          abbreviation
        }
        similarGames
      }
    }
  }
`;

interface Query {
  searchGames: {
    games: GameType[];
    count: number;
  };
}

const LIMIT = 30;

const Search: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [platforms, setPlatforms] = useState<undefined | number[]>(undefined);
  const [genres, setGenres] = useState<undefined | number[]>(undefined);

  const query = useRouteQuery();
  const { loading, error, data } = useQuery<Query>(SEARCH_GAME, {
    variables: {
      search: query.get('q'),
      offset,
      limit: LIMIT,
      platforms,
      genres,
    },
    skip: !query.get('q'),
  });

  const games = useMemo(
    () => data?.searchGames.games.map((game) => <Game key={game.id} {...game} />),
    [data]
  );

  const resultCount = useMemo(() => {
    const count = data?.searchGames.count || 0;
    return (
      <div>
        Found <b>{count}</b> games for this search
      </div>
    );
  }, [data]);

  const pagination = useMemo(() => {
    const count = data?.searchGames.count || 0;
    const numberOfPages = Math.ceil(count / LIMIT);
    const pageButtons = [];
    const activeButton = offset / LIMIT;
    for (let i = 0; i < numberOfPages; i++) {
      const button = (
        <Button
          key={i}
          type={activeButton === i ? 'primary' : 'default'}
          onClick={(): void => setOffset(LIMIT * i)}
        >
          {i + 1}
        </Button>
      );
      pageButtons.push(button);
    }
    return pageButtons;
  }, [data, offset]);

  useEffect(() => {
    setOffset(0);
  }, [query.get('q'), platforms, genres]);

  console.log({ error });

  return (
    <div className={styles.content}>
      <div className={styles['content-header']}>
        {resultCount}
        <FilterForm setPlatforms={setPlatforms} setGenres={setGenres} />
      </div>
      <div className={styles.games}>{games}</div>
      <div className={styles.pages}>{pagination}</div>
    </div>
  );
};

export default Search;
