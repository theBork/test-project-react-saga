import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers";
import { rootSaga } from "./sagas/rootSaga";

export const createStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false })
        .prepend(sagaMiddleware)
  });
  sagaMiddleware.run(rootSaga);

  return store;
}