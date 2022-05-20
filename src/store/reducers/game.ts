import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AvailableKeys } from "../../constants/keys";

interface KeyToPressData {
  keyToPress: AvailableKeys;
  pressedKey: AvailableKeys | null;
}

interface GameState {
  gameStatus: "pending" | "progress" | "lose" | "win";
  keyChain: KeyToPressData[];
  isListenKeyPress: boolean;
  livesAmount: number;
  correctSteps: number;
}

const initialState: GameState = {
  gameStatus: "pending",
  keyChain: [],
  isListenKeyPress: true,
  livesAmount: 3,
  correctSteps: 0,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetState(state) {
      state = initialState;
    },
    startGame() {},
    setGameStatus(state, action: PayloadAction<Pick<GameState, "gameStatus">>) {
      state.gameStatus = action.payload.gameStatus;
    },
    processNewStep() {},
    decreaseLivesAmount(state) {
      state.livesAmount--;
    },
    increaseCorrectSteps(state) {
      state.correctSteps++;
    },
    startListenKeyPress(state) {
      state.isListenKeyPress = true
    },
    stopListenKeyPress(state) {
      state.isListenKeyPress = false
    },
    addToKeyChain(state, action: PayloadAction<KeyToPressData>) {
      state.keyChain.push(action.payload);
    },
    keyPress(state, action: PayloadAction<string>) {},
    setPressedKey(state, action: PayloadAction<Pick<KeyToPressData, "pressedKey">>) {
      state.keyChain[state.keyChain.length - 1].pressedKey = action.payload.pressedKey;
    }
  }

})

const { actions, reducer } = gameSlice;

export const {
  resetState,
  startGame,
  setGameStatus,
  processNewStep,
  decreaseLivesAmount,
  increaseCorrectSteps,
  startListenKeyPress,
  stopListenKeyPress,
  addToKeyChain,
  keyPress,
  setPressedKey,
} = actions;

export default reducer;
