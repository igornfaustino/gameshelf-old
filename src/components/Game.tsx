import React, { useMemo, useState, useCallback } from 'react';

import { Button, Tag } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import { GameType } from '../types/common';
import styles from './Game.module.scss';
import AddGameToListModal from './AddGameToListModal';

const Game: React.FC<GameType> = (game) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const platformsTag = useMemo(
    () =>
      game.platforms?.map((platform) => (
        <Tag key={platform.id}>{platform.abbreviation || platform.name}</Tag>
      )),
    [game.platforms]
  );

  const handleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  return (
    <div className={styles['game-card']}>
      <div className={styles['img-wrapper']}>
        <img src={`https://${game.coverURL}`} alt={`${game.name} cover`} />
      </div>
      <div>
        <b>{game.name}</b>
        <p className={styles.platforms}>{platformsTag}</p>
      </div>
      <Button icon={<PlusCircleFilled />} type="primary" onClick={handleModal}>
        Add to
      </Button>
      <AddGameToListModal handleModal={handleModal} isModalVisible={isModalVisible} game={game} />
    </div>
  );
};

export default Game;
