import React, { useMemo, useCallback, useState } from 'react';

import { Modal, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import cx from 'classnames';

import styles from './AddGameToListModal.module.scss';

import { GameType } from '../types/common';
import { LIST_ICONS } from '../helpers/common';
import { GET_LISTS, ADD_GAME } from '../helpers/queries';
import Loading from './Loading';

interface ListData {
  list: {
    id: number;
    name: string;
  };
}

interface ListQuery {
  lists: ListData[];
}

interface AddGameMutation {
  addOrMoveGameToList: boolean;
}

interface Props {
  isModalVisible: boolean;
  handleModal: () => void;
  game: GameType;
}

const AddGameToListModal: React.FC<Props> = ({ isModalVisible, handleModal, game }) => {
  const history = useHistory();
  const { data } = useQuery<ListQuery>(GET_LISTS);
  const [addOrMoveGameToList] = useMutation<AddGameMutation>(ADD_GAME, {
    refetchQueries: [{ query: GET_LISTS }],
  });

  const [loading, setLoading] = useState(false);

  const gameToAdd = useMemo(
    () => ({
      gameId: game.id,
      name: game.name,
      platforms: game.platforms ? game.platforms.map((platform) => platform.id) : [],
      genres: game.genres ? game.genres.map((genre) => genre.id) : [],
      coverURL: game.coverURL,
      similarGames: game.similarGames || [],
    }),
    [game]
  );

  const onCancel = useCallback(() => (!loading ? handleModal() : undefined), [
    handleModal,
    loading,
  ]);

  const onClick = useCallback(
    (list) => async (): Promise<void> => {
      try {
        setLoading(true);
        await addOrMoveGameToList({ variables: { listId: list.id, ...gameToAdd } });
        handleModal();
      } catch (error) {
        console.log({ error, gameToAdd });
      } finally {
        setLoading(false);
      }
    },
    [addOrMoveGameToList, gameToAdd, handleModal]
  );

  const ListButtons = useMemo(
    () =>
      data?.lists.map(({ list }) => {
        const isGameOnThisList = game.list && Number(game.list.id) === Number(list.id);

        const onClickHandle = !isGameOnThisList ? onClick(list) : undefined;
        const className = isGameOnThisList
          ? cx(styles['modal-btn'], styles['modal-btn--disabled'])
          : styles['modal-btn'];
        return (
          <div className={className} role="presentation" key={list.id} onClick={onClickHandle}>
            <img src={LIST_ICONS[list.name] || ''} alt={list.name} />
            <span className={styles.btnText}>{list.name}</span>
          </div>
        );
      }),
    [data, game.list, onClick]
  );

  const modalContent = useMemo(() => {
    const hasToken = localStorage.getItem('token') || false;
    if (!hasToken)
      return (
        <>
          <Button block className={styles.margin} onClick={(): void => history.push('login')}>
            Login
          </Button>
          <Button block type="primary" onClick={(): void => history.push('singup')}>
            Sing Up
          </Button>
        </>
      );
    const lists = loading ? (
      <div className={styles.center}>
        <Loading />
      </div>
    ) : (
      <div className={styles.modal}>{ListButtons}</div>
    );
    return lists;
  }, [ListButtons, history, loading]);

  const modalTitle = useMemo(() => {
    const hasToken = localStorage.getItem('token') || false;
    const addOrMoveString = game.list?.id ? 'move' : 'add';
    return hasToken
      ? `Select a list to ${addOrMoveString} this game`
      : 'Create an account to save a game to your list';
  }, [game.list]);

  return (
    <Modal
      title={modalTitle}
      centered
      visible={isModalVisible}
      footer={null}
      closeIcon={<CloseOutlined />}
      onCancel={onCancel}
    >
      {modalContent}
    </Modal>
  );
};

export default AddGameToListModal;
