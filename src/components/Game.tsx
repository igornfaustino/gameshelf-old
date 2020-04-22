import React from 'react';
import { GameType } from '../types/common';

import styles from './Game.module.scss';

const Game: React.FC<GameType> = ({ name, coverURL }) => {
  return (
    <div className={styles['game-card']}>
      <img src={`https://${coverURL}`} alt={`${name} cover`} />
      <p>{name}</p>
    </div>
  );
};

export default Game;
