import React, { useMemo, Dispatch, SetStateAction, useCallback } from 'react';

import { gql } from 'apollo-boost';
import { Modal, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import cx from 'classnames';

import styles from './AddGameToListModal.module.scss';

import { GameType } from '../types/common';
import { LIST_ICONS } from '../helpers/common';

const GET_LISTS = gql`
  {
    lists {
      id
      name
    }
  }
`;

const ADD_GAME = gql`
  mutation addOrMoveGameToList(
    $gameId: ID!
    $listId: ID!
    $name: String!
    $coverURL: String!
    $genres: [ID]!
    $platforms: [ID]!
    $similarGames: [ID]!
  ) {
    addOrMoveGameToList(
      gameId: $gameId
      listId: $listId
      name: $name
      coverURL: $coverURL
      genres: $genres
      platforms: $platforms
      similarGames: $similarGames
    )
  }
`;

interface ListData {
  id: number;
  name: string;
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
  setLocalListInfo: Dispatch<SetStateAction<string>>;
  setLocalListId: Dispatch<SetStateAction<string>>;
}

const AddGameToListModal: React.FC<Props> = ({
  isModalVisible,
  handleModal,
  game,
  setLocalListInfo,
  setLocalListId,
}) => {
  const history = useHistory();
  const { data } = useQuery<ListQuery>(GET_LISTS);
  const [addOrMoveGameToList] = useMutation<AddGameMutation>(ADD_GAME);

  const gameToAdd = useMemo(
    () => ({
      gameId: game.id,
      name: game.name,
      platforms: game.platforms ? game.platforms.map((platform) => platform.id) : [],
      genres: game.genres ? game.genres.map((genre) => genre.id) : [],
      coverURL: game.coverURL,
      similarGames: game.similarGames,
    }),
    [game]
  );

  const onClick = useCallback(
    (list) => (): Promise<void> =>
      addOrMoveGameToList({ variables: { listId: list.id, ...gameToAdd } })
        .then(({ data: mutationResult, errors }) => {
          if (errors || !mutationResult || !mutationResult.addOrMoveGameToList) throw errors;
          setLocalListInfo(list.name);
          setLocalListId(list.id.toString());
          handleModal();
        })
        .catch((err) => {
          console.log({ err });
        }),
    [addOrMoveGameToList, gameToAdd, handleModal, setLocalListId, setLocalListInfo]
  );

  const ListButtons = useMemo(
    () =>
      data?.lists.map((list) => {
        const isGameOnThisList = game.userListId && Number(game.userListId) === Number(list.id);

        const onClickHandle = !isGameOnThisList ? onClick(list) : undefined;
        const className = isGameOnThisList
          ? cx(styles['modal-btn'], styles['modal-btn--disabled'])
          : styles['modal-btn'];
        return (
          <div className={className} role="presentation" key={list.id} onClick={onClickHandle}>
            <img src={LIST_ICONS[list.name] || ''} alt={list.name} />
            {list.name}
          </div>
        );
      }),
    [data, game.userListId, onClick]
  );

  const modalContent = useMemo(() => {
    const hasToken = localStorage.getItem('token') || false;
    const lists = <div className={styles.modal}>{ListButtons}</div>;
    const login = (
      <>
        <Button block className={styles.margin} onClick={(): void => history.push('login')}>
          Login
        </Button>
        <Button block type="primary" onClick={(): void => history.push('singup')}>
          Sing Up
        </Button>
      </>
    );
    return hasToken ? lists : login;
  }, [ListButtons, history]);

  const modalTitle = useMemo(() => {
    const hasToken = localStorage.getItem('token') || false;
    const addOrMoveString = game.userListId ? 'move' : 'add';
    return hasToken
      ? `Select a list to ${addOrMoveString} this game`
      : 'Create an account to save a game to your list';
  }, [game.userListId]);

  return (
    <Modal
      title={modalTitle}
      centered
      visible={isModalVisible}
      footer={null}
      closeIcon={<CloseOutlined />}
      onCancel={handleModal}
    >
      {modalContent}
    </Modal>
  );
};

export default AddGameToListModal;
