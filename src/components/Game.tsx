import React, { useMemo, useState, useCallback } from 'react';

import { gql } from 'apollo-boost';
import { Button, Tag } from 'antd';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { PlusCircleFilled, RightCircleOutlined, CloseOutlined } from '@ant-design/icons';

import { GameType } from '../types/common';
import styles from './Game.module.scss';
import AddGameToListModal from './AddGameToListModal';

const REMOVE_GAME = gql`
  mutation removeGameFromList($gameId: ID!) {
    removeGameFromList(gameId: $gameId)
  }
`;

interface RemoveGameMutation {
  removeGameFromList: boolean;
}

interface GameCard extends GameType {
  isUserListCard?: boolean;
}

const Game: React.FC<GameCard> = ({ isUserListCard, ...game }) => {
  const token = localStorage.getItem('token');

  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [removeGameFromList] = useMutation<RemoveGameMutation>(REMOVE_GAME);

  const handleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  const handleRemoveGame = useCallback(() => {
    if (!token) return;
    removeGameFromList({ variables: { gameId: game.id } })
      .then(({ data: mutationResult, errors }) => {
        if (errors || !mutationResult || !mutationResult.removeGameFromList) throw errors;
        dispatch({
          type: 'ADD_OR_UPDATE_GAME_LIST',
          gameList: {
            gameId: game.id,
            userList: undefined,
            listId: undefined,
          },
        });
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [dispatch, game.id, removeGameFromList, token]);

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
    if (game.userList)
      return (
        <div className={styles.listInfo}>
          {removeBtn}
          <span>{game.userList}</span>
        </div>
      );
    return undefined;
  }, [game.userList, handleRemoveGame, isUserListCard, token]);

  const cardButton = useMemo(() => {
    const isGameInList = game.userList || isUserListCard;
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
  }, [game.userList, handleModal, isUserListCard]);

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
