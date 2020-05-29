import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { Button, Tag } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import { GameType, GameAndList } from '../types/common';
import styles from './Game.module.scss';
import AddGameToListModal from './AddGameToListModal';

interface GameCard extends GameType {
  setCacheGameList: React.Dispatch<React.SetStateAction<GameAndList[]>>;
}

const Game: React.FC<GameCard> = ({ setCacheGameList, ...game }) => {
  const token = localStorage.getItem('token');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localListInfo, setLocalListInfo] = useState('');

  const platformsString = useMemo(
    () => game.platforms?.map((platform) => platform.name).join(', '),
    [game.platforms]
  );

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

  const listInfo = useMemo(() => {
    if (!token) return undefined;
    if (localListInfo) return <div className={styles.listInfo}>{localListInfo}</div>;
    if (game.userList) return <div className={styles.listInfo}>{game.userList}</div>;
    return undefined;
  }, [game.userList, localListInfo, token]);

  useEffect(() => {
    if (!localListInfo) return;

    setCacheGameList((prev) => {
      const newEntry = {
        gameId: Number(game.id),
        userList: localListInfo,
      };

      const otherCachedValues = prev.filter(
        (gameAndList) => gameAndList.gameId !== Number(game.id)
      );
      return [...otherCachedValues, newEntry];
    });
  }, [game.id, localListInfo, setCacheGameList]);

  return (
    <div className={styles['game-card']}>
      <div className={styles['img-wrapper']}>
        {listInfo}
        <img src={`https://${game.coverURL}`} alt={`${game.name} cover`} />
      </div>
      <div>
        <p className={styles.title}>{game.name}</p>
        <p className={styles.platforms}>
          {platformsTag}
          <span className={styles.tooltip}>{platformsString}</span>
        </p>
      </div>
      <Button icon={<PlusCircleFilled />} type="primary" onClick={handleModal}>
        Add to
      </Button>
      <AddGameToListModal
        handleModal={handleModal}
        isModalVisible={isModalVisible}
        game={game}
        setLocalListInfo={setLocalListInfo}
      />
    </div>
  );
};

export default Game;
