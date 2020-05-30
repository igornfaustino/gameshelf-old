const initialState = [];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function (state = initialState, action) {
  switch (action.type) {
    case 'ADD_OR_UPDATE_GAME_LIST': {
      let newState = [...state];
      newState = newState.filter(
        (gameListInState) => Number(gameListInState.gameId) !== Number(action.gameList.gameId)
      );
      newState.push(action.gameList);
      return newState;
    }
    default:
      return state;
  }
}
