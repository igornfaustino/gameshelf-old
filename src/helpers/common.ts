import TO_PLAY_IMG from '../assets/003-bookshelf.svg';
import PLAYING_IMG from '../assets/001-game-controller.svg';
import COMPLETED_IMG from '../assets/002-award.svg';
import ABANDONED_IMG from '../assets/004-spider-web.svg';

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

export const LIST_ICONS: { [index: string]: string } = {
  'To Play': TO_PLAY_IMG,
  Playing: PLAYING_IMG,
  Completed: COMPLETED_IMG,
  Abandoned: ABANDONED_IMG,
};
