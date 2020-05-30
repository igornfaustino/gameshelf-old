import { createStore, combineReducers } from 'redux';
import gameListReducer from './gameListReducer';
// import { videoReducer } from './videoReducer';
// import { timelineReducer } from './timelineReducer';
// import { sceneAndChaptersReducer } from './scenesAndChaptersReducer';

export default createStore(
  combineReducers({
    gameAndList: gameListReducer,
  }),
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
