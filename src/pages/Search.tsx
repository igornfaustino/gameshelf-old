import React, { useMemo, useState, useEffect } from 'react';

import { Button } from 'antd';
import { useQuery } from '@apollo/react-hooks';

import useRouteQuery from '../hooks/useQuery';
import { GameType, GameAndList } from '../types/common';
import styles from './Search.module.scss';
import FilterForm from '../components/FilterForm';
import GamesDisplay from '../components/GamesDisplay';
import { SEARCH_GAME } from '../helpers/queries';

interface Query {
  searchGames: {
    games: GameType[];
    count: number;
  };
}

interface StateType {
  gameAndList: GameAndList[];
}

const LIMIT = 30;

const Search: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [platforms, setPlatforms] = useState<undefined | number[]>(undefined);
  const [genres, setGenres] = useState<undefined | number[]>(undefined);
  const [games, setGames] = useState<GameType[]>([]);

  const query = useRouteQuery();
  const gameQuery = query.get('q');

  const { loading, error, data, refetch } = useQuery<Query>(SEARCH_GAME, {
    variables: {
      search: gameQuery,
      offset,
      limit: LIMIT,
      platforms,
      genres,
    },
    skip: !gameQuery,
  });

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
          onClick={(): void => {
            setOffset(LIMIT * i);
            window.scrollTo(0, 0);
          }}
        >
          {i + 1}
        </Button>
      );
      pageButtons.push(button);
    }
    return pageButtons;
  }, [data, offset]);

  const searchResult = useMemo(
    () =>
      loading ? (
        <div>Loading</div>
      ) : (
        <>
          <GamesDisplay games={games} />
          <div className={styles.pages}>{pagination}</div>
        </>
      ),
    [games, loading, pagination]
  );

  useEffect(() => {
    setOffset(0);
  }, [gameQuery, platforms, genres]);

  useEffect(() => {
    const searchedGames = data?.searchGames.games;
    if (!searchedGames) return setGames([]);
    return setGames(searchedGames);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className={styles.content}>
      <div className={styles['content-header']}>
        {resultCount}
        <FilterForm setPlatforms={setPlatforms} setGenres={setGenres} />
      </div>
      {searchResult}
    </div>
  );
};

export default Search;
