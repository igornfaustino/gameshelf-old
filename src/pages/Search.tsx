import React, { useMemo, useState, useEffect } from 'react';

import { Button } from 'antd';
import { useQuery } from '@apollo/client';

import useURLQuery from '../hooks/useURLQuery';
import { GameAndList } from '../types/common';
import styles from './Search.module.scss';
import FilterForm from '../components/FilterForm';
import GamesDisplay from '../components/GamesDisplay';
import { SEARCH_GAME } from '../helpers/queries';
import Loading from '../components/Loading';

interface Query {
  searchGames: {
    gamesAndList: GameAndList[];
    count: number;
  };
}

const LIMIT = 30;

const Search: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [platforms, setPlatforms] = useState<undefined | number[]>(undefined);
  const [genres, setGenres] = useState<undefined | number[]>(undefined);
  const [gamesAndList, setGamesAndList] = useState<GameAndList[]>([]);

  const queries = useURLQuery();
  const gameQuery = queries.get('q');

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
        <div className={styles.center}>
          <Loading fontSize={56} />
        </div>
      ) : (
        <>
          <GamesDisplay gamesAndList={gamesAndList} />
          <div className={styles.pages}>{pagination}</div>
        </>
      ),
    [gamesAndList, loading, pagination]
  );

  useEffect(() => {
    setOffset(0);
  }, [gameQuery, platforms, genres]);

  useEffect(() => {
    const searchedGames = data?.searchGames.gamesAndList;
    if (!searchedGames) return setGamesAndList([]);
    return setGamesAndList(searchedGames);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!error) return;
    console.log({ error });
  }, [error]);

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
