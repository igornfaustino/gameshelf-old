import React, { useState, useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';

import { GameType, GameAndList } from '../types/common';
import GamesDisplay from '../components/GamesDisplay';
import { GET_GAMES_FROM_LIST } from '../helpers/queries';

interface ListContentType {
  listId: string;
}

interface Query {
  getGamesFromList: GameType[];
}

interface StateType {
  gameAndList: GameAndList[];
}

const ListContent: React.FC<ListContentType> = ({ listId }) => {
  const [games, setGames] = useState<GameType[]>([]);

  const { loading, error, data } = useQuery<Query>(GET_GAMES_FROM_LIST, {
    variables: {
      listId,
    },
    skip: !listId,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const gamesOnList = data?.getGamesFromList;
    if (!gamesOnList) return setGames([]);
    return setGames(gamesOnList.filter((game) => Number(game.list?.id) === Number(listId)));
  }, [data, listId]);

  return (
    <>
      <GamesDisplay games={games} isGamesOnList />
    </>
  );
};

export default ListContent;
