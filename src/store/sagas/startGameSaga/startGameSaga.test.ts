import { expectSaga } from "redux-saga-test-plan";
import { startGameSaga } from "./startGameSaga";
import rootReducer from "../../reducers";
import { startGame, initialState as initialGameState } from "../../reducers/game";
import { AppState } from "../../store";

describe("startGameSaga", () => {
  it("правильный стэйт после завершения саги", async () => {
    const initialState: AppState = { game: initialGameState };
    const saga = expectSaga(startGameSaga).withReducer(rootReducer, initialState);

    const result = await saga.dispatch(startGame()).silentRun();

    expect(result.storeState.game).toEqual({ ...initialGameState, gameStatus: "progress" });
  });
});
