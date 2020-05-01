import React, { useMemo } from 'react';

import { gql } from 'apollo-boost';
import { Modal, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/react-hooks';

import styles from './AddGameToListModal.module.scss';

import TO_PLAY_IMG from '../assets/003-bookshelf.svg';
import PLAYING_IMG from '../assets/001-game-controller.svg';
import COMPLETED_IMG from '../assets/002-award.svg';
import ABANDONED_IMG from '../assets/004-spider-web.svg';
import { GameType } from '../types/common';

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

const BTN_IMG: { [index: string]: string } = {
  'To Play': TO_PLAY_IMG,
  Playing: PLAYING_IMG,
  Completed: COMPLETED_IMG,
  Abandoned: ABANDONED_IMG,
};

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
}

const AddGameToListModal: React.FC<Props> = ({ isModalVisible, handleModal, game }) => {
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

  const ListButtons = useMemo(
    () =>
      data?.lists.map((list) => (
        <div
          className={styles['modal-btn']}
          role="presentation"
          key={list.id}
          onClick={(): Promise<void> =>
            addOrMoveGameToList({ variables: { listId: list.id, ...gameToAdd } })
              .then(({ data: mutationResult, errors }) => {
                if (errors || !mutationResult || !mutationResult.addOrMoveGameToList) throw errors;

                handleModal();
              })
              .catch(() => {
                alert('ops, something goes wrong');
              })
          }
        >
          <img src={BTN_IMG[list.name] || ''} alt={list.name} />
          {list.name}
        </div>
      )),
    [addOrMoveGameToList, data, gameToAdd, handleModal]
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
    return hasToken
      ? 'Select a list to add this game'
      : 'Create an account to save a game to your list';
  }, []);

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
