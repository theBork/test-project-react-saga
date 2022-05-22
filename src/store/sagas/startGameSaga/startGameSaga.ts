import { put, takeEvery } from "redux-saga/effects";

import { resetState, startGame, setGameStatus } from "../../reducers/game";

function* workStartGame() {
  yield put(resetState());
  yield put(setGameStatus({ gameStatus: "progress"}));
}

export function* startGameSaga() {
  yield takeEvery(startGame.type, workStartGame);
}
