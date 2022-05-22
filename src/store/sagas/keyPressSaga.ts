import { put, takeEvery } from "redux-saga/effects";

import { availableKeysMap, AvailableKeys } from "../../constants/keys";
import { keyPress, setPressedKey, stopListenKeyPress } from "../reducers/game";

const isValidKey = (key: string): key is AvailableKeys => {
	return Object.keys(availableKeysMap).includes(key);
}

function* workHandleKeyPress(action: ReturnType<typeof keyPress>) {
  yield put(stopListenKeyPress());
  const pressedKey = action.payload;
  if (isValidKey(pressedKey)) yield put(setPressedKey({ pressedKey }));
}

export function* keyPressSaga() {
  yield takeEvery(keyPress.type, workHandleKeyPress)
}
