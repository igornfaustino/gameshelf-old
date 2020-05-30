import { gql } from 'apollo-boost';

export const REMOVE_GAME = gql`
  mutation removeGameFromList($gameId: ID!) {
    removeGameFromList(gameId: $gameId) {
      id
      list {
        id
        name
      }
    }
  }
`;

export const GET_LISTS = gql`
  {
    lists {
      id
      name
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const SING_UP = gql`
  mutation singUp($name: String!, $email: String!, $password: String!) {
    singUp(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

export const ADD_GAME = gql`
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
    ) {
      id
      list {
        id
        name
      }
    }
  }
`;

export const SEARCH_GAME = gql`
  query searchGames(
    $search: String!
    $platforms: [Int]
    $genres: [Int]
    $limit: Int
    $offset: Int
  ) {
    searchGames(
      search: $search
      platforms: $platforms
      genres: $genres
      limit: $limit
      offset: $offset
    ) {
      count
      games {
        id
        name
        coverURL
        genres {
          id
          name
        }
        platforms {
          id
          name
          abbreviation
        }
        similarGames
        list {
          id
          name
        }
      }
    }
  }
`;

export const GET_GAMES_FROM_LIST = gql`
  query getGamesFromList($listId: ID) {
    getGamesFromList(listId: $listId) {
      id
      name
      coverURL
      genres {
        id
        name
      }
      platforms {
        id
        name
        abbreviation
      }
      similarGames
      list {
        id
        name
      }
    }
  }
`;

export const GET_PLATFORMS = gql`
  {
    platforms {
      id
      name
      abbreviation
    }
  }
`;

export const GET_GENRES = gql`
  {
    genres {
      id
      name
    }
  }
`;
