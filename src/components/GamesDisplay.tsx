import React, { useMemo, useState } from 'react';

import Game from './Game';
import styles from './GamesDisplay.module.scss';
import { GameType, GameAndList } from '../types/common';

interface GameDisplayType {
  games: GameType[];
  setCacheGameList: React.Dispatch<React.SetStateAction<GameAndList[]>>;
  isGamesOnList?: boolean;
}

const GamesDisplay: React.FC<GameDisplayType> = ({ games, setCacheGameList, isGamesOnList }) => {
  const gameCards = useMemo(
    () =>
      games.map((game) => (
        <Game
          key={game.id}
          {...game}
          setCacheGameList={setCacheGameList}
          isUserListCard={isGamesOnList}
        />
      )),
    [games, isGamesOnList, setCacheGameList]
  );

  return <div className={styles.games}>{gameCards}</div>;
};

export default GamesDisplay;
