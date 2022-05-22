import { expectSaga } from "redux-saga-test-plan";
import rootReducer from "../../reducers";
import { getRandomAvailableKey } from "../../../utils/getRandomAvailableKey";
import { processNewStepSaga } from "./processNewStepSaga";
import { processNewStep, initialState as initialGameState, GameState } from "../../reducers/game";
import { AppState } from "../../store";

jest.mock("../../../utils/getRandomAvailableKey");
const mockedGetRandomAvailableKey = getRandomAvailableKey as jest.Mock<string>;

describe("processNewStepSaga", () => {
  beforeEach(() => {
    mockedGetRandomAvailableKey.mockReturnValue("ArrowUp");
  });

  describe("если ход первый", () => {
    it("происходит только назначение следующего", async () => {
      const state: AppState = {
        game: {
          ...initialGameState,
          gameStatus: "progress",
        }
      };

      const saga = expectSaga(processNewStepSaga).withReducer(rootReducer, state);

      const result = await saga.dispatch(processNewStep()).silentRun();

      expect(result.storeState.game).toEqual({
        ...state.game,
        keyChain: [
          { keyToPress: "ArrowUp", pressedKey: null },
        ],
      });
    });
  });

  describe("если ход не первый и не последний", () => {
    it("корректно считается результат предыдущего верного хода и назначается новый", async () => {
      const state: AppState = {
        game: {
          ...initialGameState,
          gameStatus: "progress",
          keyChain: [
            { keyToPress: "ArrowUp", pressedKey: "ArrowUp" }
          ],
        }
      };

      const saga = expectSaga(processNewStepSaga).withReducer(rootReducer, state);

      const result = await saga.dispatch(processNewStep()).silentRun();

      expect(result.storeState.game).toEqual({
        ...state.game,
        correctSteps: state.game.correctSteps + 1,
        keyChain: [
          { keyToPress: "ArrowUp", pressedKey: "ArrowUp" },
          { keyToPress: "ArrowUp", pressedKey: null },
        ],
      });
    });

    it("корректно считается результат предыдущего ошибочного хода и назначается новый", async () => {
      const state: AppState = {
        game: {
          ...initialGameState,
          gameStatus: "progress",
          keyChain: [
            { keyToPress: "ArrowUp", pressedKey: "ArrowDown" }
          ],
        }
      };

      const saga = expectSaga(processNewStepSaga).withReducer(rootReducer, state);

      const result = await saga.dispatch(processNewStep()).silentRun();

      expect(result.storeState.game).toEqual({
        ...state.game,
        livesAmount: state.game.livesAmount - 1,
        keyChain: [
          { keyToPress: "ArrowUp", pressedKey: "ArrowDown" },
          { keyToPress: "ArrowUp", pressedKey: null },
        ],
      });
    });

    it("корректно считается результат предыдущего пропущенного хода и назначается новый", async () => {
      const state: AppState = {
        game: {
          ...initialGameState,
          gameStatus: "progress",
          keyChain: [
            { keyToPress: "ArrowUp", pressedKey: null }
          ],
        }
      };

      const saga = expectSaga(processNewStepSaga).withReducer(rootReducer, state);

      const result = await saga.dispatch(processNewStep()).silentRun();

      expect(result.storeState.game).toEqual({
        ...state.game,
        livesAmount: state.game.livesAmount - 1,
        keyChain: [
          { keyToPress: "ArrowUp", pressedKey: null },
          { keyToPress: "ArrowUp", pressedKey: null },
        ],
      });
    });
  });

  describe("если ход последний", () => {
    const commonKeyChain: GameState["keyChain"] = [
      { keyToPress: "ArrowUp", pressedKey: "ArrowUp" },
      { keyToPress: "ArrowUp", pressedKey: "ArrowDown" },
      { keyToPress: "ArrowUp", pressedKey: "ArrowUp" },
      { keyToPress: "ArrowUp", pressedKey: "ArrowDown" },
    ];

    const commonGameStateProps: Partial<GameState> = {
      correctSteps: 2,
      livesAmount: 1,
    };

    it("корректно считается результат предыдущего верного хода и игра заканчивается выигрышем", async () => {
      const state: AppState = {
        game: {
          ...initialGameState,
          ...commonGameStateProps,
          keyChain: [
            ...commonKeyChain,
            { keyToPress: "ArrowUp", pressedKey: "ArrowUp" },
          ]
        }
      };

      const saga = expectSaga(processNewStepSaga).withReducer(rootReducer, state);

      const result = await saga.dispatch(processNewStep()).silentRun();

      expect(result.storeState.game).toEqual({
        ...state.game,
        gameStatus: "win",
        correctSteps: state.game.correctSteps + 1,
      });
    });

    it("корректно считается результат предыдущего ошибочного хода и игра заканчивается выигрышем", async () => {
      const state: AppState = {
        game: {
          ...initialGameState,
          ...commonGameStateProps,
          keyChain: [
            ...commonKeyChain,
            { keyToPress: "ArrowUp", pressedKey: "ArrowDown" },
          ]
        }
      };

      const saga = expectSaga(processNewStepSaga).withReducer(rootReducer, state);

      const result = await saga.dispatch(processNewStep()).silentRun();

      expect(result.storeState.game).toEqual({
        ...state.game,
        gameStatus: "lose",
        livesAmount: state.game.livesAmount - 1,
      });
    });

    it("корректно считается результат предыдущего ошибочного хода и игра заканчивается выигрышем", async () => {
      const state: AppState = {
        game: {
          ...initialGameState,
          ...commonGameStateProps,
          keyChain: [
            ...commonKeyChain,
            { keyToPress: "ArrowUp", pressedKey: null },
          ]
        }
      };

      const saga = expectSaga(processNewStepSaga).withReducer(rootReducer, state);

      const result = await saga.dispatch(processNewStep()).silentRun();

      expect(result.storeState.game).toEqual({
        ...state.game,
        gameStatus: "lose",
        livesAmount: state.game.livesAmount - 1,
      });
    });
  });
});
