import { put, select, takeEvery } from "redux-saga/effects";

import {
  processNewStep,
  decreaseLivesAmount,
  increaseCorrectSteps,
  setGameStatus,
  addToKeyChain,
  startListenKeyPress,
} from "../../reducers/game";

import { getRandomAvailableKey } from "../../../utils/getRandomAvailableKey";
import { AppState } from "../../store";

function* workCurrentStepResults() {
  const { keyChain }: AppState["game"] = yield select((state: AppState) => state.game);
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
  const { livesAmount, correctSteps }: AppState["game"] = yield select(state => state.game);
  if (livesAmount <= 0) {
    yield put(setGameStatus({ gameStatus: "lose" }));
  }
  if (correctSteps >= 3) {
    yield put(setGameStatus({ gameStatus: "win" }));
  }
}

function* workAddNewStep() {
  const nextKey = getRandomAvailableKey();
  yield put(addToKeyChain({ keyToPress: nextKey, pressedKey: null }));
  yield put(startListenKeyPress());
}

function* workProcessNewStep() {
  yield workCurrentStepResults();
  yield workUpdateGameStatus();
  const { gameStatus }: AppState["game"] = yield select(state => state.game);
  if (gameStatus === "progress") yield workAddNewStep();
}

export function* processNewStepSaga() {
  yield takeEvery(processNewStep.type, workProcessNewStep);
}
