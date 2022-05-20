import { put, select, takeEvery } from "redux-saga/effects";

import {
  processNewStep,
  decreaseLivesAmount,
  increaseCorrectSteps,
  setGameStatus,
  addToKeyChain,
  startListenKeyPress,
} from "../reducers/game";

import { availableKeysMap, AvailableKeys } from "../../constants/keys";
import { RootState } from "../reducers";

function* workCurrentStepResults() {
  const keyChain = yield select(state => state.game.keyChain);
  if (keyChain.length) {
    const currKey = keyChain[keyChain.length - 1];
    if (currKey.keyToPress !== currKey.pressedKey) {
      yield put(decreaseLivesAmount())
    } else {
      yield put(increaseCorrectSteps())
    }
  }
}

function* workUpdateGameStatus() {
  const { game: { livesAmount, correctSteps } }: RootState = yield select(state => state);
  if (livesAmount <= 0) {
    yield put(setGameStatus({ gameStatus: "lose" }));
  }
  if (correctSteps >= 3) {
    yield put(setGameStatus({ gameStatus: "win" }));
  }
}

function* workAddNewStep() {
  const availableKeys = Object.keys(availableKeysMap) as AvailableKeys[];
  const nextKey = availableKeys[Math.floor(Math.random() * 4)];
  yield put(addToKeyChain({ keyToPress: nextKey, pressedKey: null }));
  yield put(startListenKeyPress());
}

function* workProcessNewStep() {
  yield workCurrentStepResults();
  yield workUpdateGameStatus();
  const { game: { gameStatus } }: RootState = yield select(state => state);
  if (gameStatus === "progress") yield workAddNewStep();
}

export function* processNewStepSaga() {
  yield takeEvery(processNewStep.type, workProcessNewStep);
}
