import React, { useState, useEffect, useMemo } from 'react';

import { Button } from 'antd';
import { useQuery } from '@apollo/client';

import { GameType, GameAndList } from '../types/common';
import GamesDisplay from '../components/GamesDisplay';
import { GET_GAMES_FROM_LIST } from '../helpers/queries';
import FilterForm from '../components/FilterForm';
import styles from './ListContent.module.scss';
import Loading from '../components/Loading';

interface ListContentType {
  listId: string;
}

interface Query {
  getGamesFromList: {
    games: GameType[];
    count: number;
  };
}

interface StateType {
  gameAndList: GameAndList[];
}

const LIMIT = 30;

const ListContent: React.FC<ListContentType> = ({ listId }) => {
  const [offset, setOffset] = useState(0);
  const [games, setGames] = useState<GameType[]>([]);
  const [platforms, setPlatforms] = useState<undefined | number[]>(undefined);
  const [genres, setGenres] = useState<undefined | number[]>(undefined);

  const { loading, error, data } = useQuery<Query>(GET_GAMES_FROM_LIST, {
    variables: {
      listId,
      offset,
      limit: LIMIT,
      platforms,
      genres,
    },
    skip: !listId,
    fetchPolicy: 'network-only',
  });

  const pagination = useMemo(() => {
    const count = data?.getGamesFromList.count || 0;
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

  const gamesResult = useMemo(
    () =>
      loading ? (
        <div className={styles.center}>
          <Loading fontSize={56} />
        </div>
      ) : (
        <>
          <GamesDisplay games={games} isGamesOnList />
          <div className={styles.pages}>{pagination}</div>
        </>
      ),
    [games, loading, pagination]
  );

  useEffect(() => {
    setOffset(0);
    window.scrollTo(0, 0);
  }, [platforms, genres, listId]);

  useEffect(() => {
    const gamesOnList = data?.getGamesFromList.games;
    if (!gamesOnList) return setGames([]);
    return setGames(gamesOnList.filter((game) => Number(game.list?.id) === Number(listId)));
  }, [data, listId]);

  return (
    <>
      <div className={styles['content-header']}>
        <FilterForm setPlatforms={setPlatforms} setGenres={setGenres} />
      </div>
      {gamesResult}
    </>
  );
};

export default ListContent;
