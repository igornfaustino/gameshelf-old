import React, { useState, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import { GameType, GameAndList } from '../types/common';
import GamesDisplay from '../components/GamesDisplay';
import { filterGamesThatAreNoLongOnTheList } from '../helpers/common';

interface ListContentType {
  listId: string;
}

interface Query {
  getGamesFromList: GameType[];
}

const GET_GAMES_FROM_LIST = gql`
  query getGamesFromList($listId: ID) {
    getGamesFromList(listId: $listId) {
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
      userList
    }
  }
`;

const ListContent: React.FC<ListContentType> = ({ listId }) => {
  const [games, setGames] = useState<GameType[]>([]);
  const [cacheGameList, setCacheGameList] = useState<GameAndList[]>([]);

  const { loading, error, data } = useQuery<Query>(GET_GAMES_FROM_LIST, {
    variables: {
      listId,
    },
    skip: !listId,
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    const gamesOnList = data?.getGamesFromList;
    if (!gamesOnList) return setGames([]);
    console.log(listId);
    return setGames(filterGamesThatAreNoLongOnTheList(gamesOnList, cacheGameList, listId));
  }, [cacheGameList, data, listId]);

  return (
    <>
      <GamesDisplay games={games} setCacheGameList={setCacheGameList} />
    </>
  );
};

export default ListContent;
