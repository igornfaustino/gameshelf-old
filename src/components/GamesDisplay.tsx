import React, { useMemo } from 'react';

import Game from './Game';
import styles from './GamesDisplay.module.scss';
import { GameType } from '../types/common';

interface GameDisplayType {
  games: GameType[];
  isGamesOnList?: boolean;
}

const GamesDisplay: React.FC<GameDisplayType> = ({ games, isGamesOnList }) => {
  const gameCards = useMemo(
    () => games.map((game) => <Game key={game.id} {...game} isUserListCard={isGamesOnList} />),
    [games, isGamesOnList]
  );

  return <div className={styles.games}>{gameCards}</div>;
};

export default GamesDisplay;
