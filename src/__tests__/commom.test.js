import { binarySearch, LIST_ICONS } from '../helpers/common';

test('Assert list icons path', () => {
  expect(JSON.stringify(LIST_ICONS)).toMatchSnapshot();
});

const data = [
  { num: 1 },
  { num: 3 },
  { num: 5 },
  { num: 7 },
  { num: 9 },
  { num: 11 },
  { num: 13 },
  { num: 15 },
];

describe('Binary search algorithm', () => {
  test('should get the right value', () => {
    const searchResult = binarySearch(data, 3, ({ num }) => num);
    expect(JSON.stringify(searchResult)).toBe(JSON.stringify({ num: 3 }));
  });

  test('should get undefined', () => {
    const searchResult = binarySearch(data, 10, ({ num }) => num);
    expect(searchResult).toBeUndefined();
  });
});
