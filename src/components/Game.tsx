import React, { useMemo, useState, useCallback } from 'react';

import { Button, Tag } from 'antd';
import { useMutation } from '@apollo/client';
import { PlusCircleFilled, RightCircleOutlined, CloseOutlined } from '@ant-design/icons';

import { GameType } from '../types/common';
import styles from './Game.module.scss';
import AddGameToListModal from './AddGameToListModal';
import { REMOVE_GAME, GET_LISTS } from '../helpers/queries';
import Loading from './Loading';

interface RemoveGameMutation {
  removeGameFromList: GameType;
}

interface GameCard extends GameType {
  isUserListCard?: boolean;
}

const Game: React.FC<GameCard> = ({ isUserListCard, ...game }) => {
  const token = localStorage.getItem('token');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [removeGameFromList] = useMutation<RemoveGameMutation>(REMOVE_GAME, {
    refetchQueries: [{ query: GET_LISTS }],
  });

  const handleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  const handleRemoveGame = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      await removeGameFromList({ variables: { gameId: game.id } });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [game.id, removeGameFromList, token]);

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

  const listInfo = useMemo(() => {
    if (!token) return undefined;
    const removeBtn = <CloseOutlined onClick={handleRemoveGame} />;
    if (isUserListCard) return <div className={styles.listInfo}>{removeBtn}</div>;
    if (!game.list?.name) return undefined;
    const infoContent = loading ? (
      <Loading fontSize={24} />
    ) : (
      <>
        {removeBtn}
        <span>{game.list?.name}</span>
      </>
    );
    return <div className={styles.listInfo}>{infoContent}</div>;
  }, [game.list, handleRemoveGame, isUserListCard, loading, token]);

  const cardButton = useMemo(() => {
    const isGameInList = game.list?.name || isUserListCard;
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
  }, [game.list, handleModal, isUserListCard]);

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
      <AddGameToListModal handleModal={handleModal} isModalVisible={isModalVisible} game={game} />
    </div>
  );
};

export default Game;
