import { GameType, GameAndList } from '../types/common';

// eslint-disable-next-line import/prefer-default-export
export function binarySearch<T>(
  list: T[],
  value: number,
  getValueToCompare: (element: T) => number
): T | undefined {
  let start = 0;
  let end = list.length - 1;
  while (start <= end) {
    const middlePos = Math.floor((start + end) / 2);
    const middleElement = list[middlePos];
    if (getValueToCompare(middleElement) < value) {
      start = middlePos + 1;
    } else if (getValueToCompare(middleElement) > value) {
      end = middlePos - 1;
    } else {
      return list[middlePos];
    }
  }
  return undefined;
}

export const joinGamesAndCachedInfo = (games: GameType[], cached: GameAndList[]): GameType[] => {
  const sortedCached = cached.sort((a, b) => a.gameId - b.gameId);
  return games.map((game) => {
    const cachedInfo = binarySearch<GameAndList>(
      sortedCached,
      Number(game.id),
      (element) => element.gameId
    );
    if (!cachedInfo) return game;
    return { ...game, userList: cachedInfo.userList };
  });
};
