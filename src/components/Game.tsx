import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { Button, Tag } from 'antd';
import { PlusCircleFilled, RightCircleOutlined } from '@ant-design/icons';

import { GameType, GameAndList } from '../types/common';
import styles from './Game.module.scss';
import AddGameToListModal from './AddGameToListModal';

interface GameCard extends GameType {
  setCacheGameList: React.Dispatch<React.SetStateAction<GameAndList[]>>;
  isUserListCard?: boolean;
}

const Game: React.FC<GameCard> = ({ setCacheGameList, isUserListCard, ...game }) => {
  const token = localStorage.getItem('token');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localListInfo, setLocalListInfo] = useState('');
  const [localListId, setLocalListId] = useState('');

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
    if (!token || isUserListCard) return undefined;
    if (localListInfo) return <div className={styles.listInfo}>{localListInfo}</div>;
    if (game.userList) return <div className={styles.listInfo}>{game.userList}</div>;
    return undefined;
  }, [game.userList, isUserListCard, localListInfo, token]);

  const cardButton = useMemo(() => {
    const isGameInList = game.userList || localListInfo || isUserListCard;
    if (isGameInList)
      return (
        <Button icon={<RightCircleOutlined />} type="default" onClick={handleModal}>
          Move to
        </Button>
      );
    return (
      <Button icon={<PlusCircleFilled />} type="primary" onClick={handleModal}>
        Add to
      </Button>
    );
  }, [game.userList, handleModal, isUserListCard, localListInfo]);

  useEffect(() => {
    if (!localListInfo) return;

    setCacheGameList((prev) => {
      const newEntry = {
        gameId: Number(game.id),
        userList: localListInfo,
        listId: localListId,
      };

      const otherCachedValues = prev.filter(
        (gameAndList) => gameAndList.gameId !== Number(game.id)
      );
      return [...otherCachedValues, newEntry];
    });
  }, [game.id, localListId, localListInfo, setCacheGameList]);

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
      {cardButton}
      <AddGameToListModal
        handleModal={handleModal}
        isModalVisible={isModalVisible}
        game={game}
        setLocalListInfo={setLocalListInfo}
        setLocalListId={setLocalListId}
      />
    </div>
  );
};

export default Game;
