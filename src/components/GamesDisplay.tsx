import React, { useMemo } from 'react';

import Game from './Game';
import styles from './GamesDisplay.module.scss';
import { GameAndList } from '../types/common';

interface GameDisplayType {
  gamesAndList: GameAndList[];
  isGamesOnList?: boolean;
}

const GamesDisplay: React.FC<GameDisplayType> = ({ gamesAndList, isGamesOnList }) => {
  const gameCards = useMemo(
    () =>
      gamesAndList.map(({ gameInfo, list }) => (
        <Game key={gameInfo.id} {...gameInfo} list={list} isUserListCard={isGamesOnList} />
      )),
    [gamesAndList, isGamesOnList]
  );

  return <div className={styles.games}>{gameCards}</div>;
};

export default GamesDisplay;
