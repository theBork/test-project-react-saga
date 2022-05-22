import { expectSaga } from "redux-saga-test-plan";
import { keyPressSaga } from "./keyPressSaga";
import rootReducer from "../../reducers";
import { keyPress, initialState as initialGameState } from "../../reducers/game";
import {AppState} from "../../store";

describe("keyPressSaga", () => {

  describe("только допустимые кнопки попадают в pressedKey", () => {
    const testCases: Array<[string, boolean]> = [
      ["ArrowUp", true],
      ["ArrowDown", true],
      ["ArrowLeft", true],
      ["ArrowRight", true],
      ["Shift", false],
      ["1", false],
      ["Q", false],
      ["q", false],
      ["Й", false],
      ["й", false],
    ];

    it.each(testCases)("кнопка: %p, результат: %p", async (button, isPlacedInState) => {
      const initialState: AppState = {
        game: {
          ...initialGameState,
          gameStatus: "progress",
          keyChain: [
            { keyToPress: "ArrowUp", pressedKey: null },
          ],
        },
      };
      const saga = expectSaga(keyPressSaga).withReducer(rootReducer, initialState);

      const result = await saga.dispatch(keyPress(button)).silentRun();

      expect(result.storeState.game).toEqual({
        ...initialGameState,
        isListenKeyPress: false,
        gameStatus: "progress",
        keyChain: [
          { keyToPress: "ArrowUp", pressedKey: isPlacedInState ? button : null },
        ],
      });
    })
  });
});
