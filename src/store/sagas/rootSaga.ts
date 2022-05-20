import { all, fork } from "redux-saga/effects";
import { processNewStepSaga } from "./processNewStepSaga";
import { startGameSaga } from "./startGameSaga";
import { keyPressSaga } from "./keyPressSaga";

export function* rootSaga() {
  yield all([
    fork(startGameSaga),
    fork(processNewStepSaga),
    fork(keyPressSaga),
  ]);
}
