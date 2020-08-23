import {
  GET_GAMES_FROM_LIST,
  ADD_GAME,
  GET_GENRES,
  GET_LISTS,
  GET_PLATFORMS,
  LOGIN,
  REMOVE_GAME,
  SEARCH_GAME,
  SING_UP,
} from './queries';

describe('Queries file', () => {
  test('Assert GET_GAMES_FROM_LIST query', () => {
    expect(GET_GAMES_FROM_LIST).toMatchSnapshot();
  });

  test('Assert ADD_GAME query', () => {
    expect(ADD_GAME).toMatchSnapshot();
  });

  test('Assert GET_GENRES query', () => {
    expect(GET_GENRES).toMatchSnapshot();
  });

  test('Assert GET_LISTS query', () => {
    expect(GET_LISTS).toMatchSnapshot();
  });

  test('Assert GET_PLATFORMS query', () => {
    expect(GET_PLATFORMS).toMatchSnapshot();
  });

  test('Assert LOGIN query', () => {
    expect(LOGIN).toMatchSnapshot();
  });

  test('Assert REMOVE_GAME query', () => {
    expect(REMOVE_GAME).toMatchSnapshot();
  });

  test('Assert SEARCH_GAME query', () => {
    expect(SEARCH_GAME).toMatchSnapshot();
  });

  test('Assert SING_UP query', () => {
    expect(SING_UP).toMatchSnapshot();
  });
});
