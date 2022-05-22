import React from "react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { render, screen, act, getByText } from "./test-utils";
import { getRandomAvailableKey } from "./utils/getRandomAvailableKey";
import { availableKeysMap } from "./constants/keys";

jest.mock("./utils/getRandomAvailableKey");
const mockedGetRandomAvailableKey = getRandomAvailableKey as jest.Mock<string>;

jest.spyOn(global, "alert");
describe("App", () => {
  // @ts-ignore
  jest.useFakeTimers("modern");

  const alignedArrowClassName = "main-container__input-value_aligned";
  const errorArrowClassName = "main-container__input-value_error";

  it("проверка корректности визуализации кнопок для нажатия и нажатых кнопок", async () => {
    const user = userEvent.setup({ delay: null });

    mockedGetRandomAvailableKey
      .mockReturnValueOnce("ArrowUp")
      .mockReturnValueOnce("ArrowDown")
      .mockReturnValue("ArrowUp")

    render(<App />);

    await user.click(screen.getByText(/начать игру/i));

    expect(screen.queryByText(/начать игру/i)).toBeNull();

    // При старте игры контейнер с кнопками пустой
    expect(screen.queryByTestId("key-to-press")).toBeNull();
    expect(screen.queryByTestId("pressed-key")).toBeNull();

    // Выдача первого хода
    jest.advanceTimersByTime(3000);
    (() => {
      const keysToPressElements = screen.getAllByTestId("key-to-press");
      const pressedKeysElements = screen.getAllByTestId("pressed-key");
      expect(keysToPressElements).toHaveLength(1);
      expect(pressedKeysElements).toHaveLength(1);
      expect(getByText(keysToPressElements[0], availableKeysMap.ArrowUp)).toBeInTheDocument();
      expect(keysToPressElements[0]).not.toHaveClass(alignedArrowClassName);
      expect(keysToPressElements[0]).not.toHaveClass(errorArrowClassName);
      expect(pressedKeysElements[0].innerHTML).toBe("");
    })()

    // Нажатие правильной кнопки
    await user.keyboard("{arrowup}");
    (() => {
      const keysToPressElements = screen.getAllByTestId("key-to-press");
      const pressedKeysElements = screen.getAllByTestId("pressed-key");
      expect(getByText(pressedKeysElements[0], availableKeysMap.ArrowUp)).toBeInTheDocument();
      expect(keysToPressElements[0]).toHaveClass(alignedArrowClassName);
      expect(keysToPressElements[0]).not.toHaveClass(errorArrowClassName);
    })()

    // Выдача второго хода
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    (() => {
      const keysToPressElements = screen.getAllByTestId("key-to-press");
      const pressedKeysElements = screen.getAllByTestId("pressed-key");
      expect(keysToPressElements).toHaveLength(2);
      expect(pressedKeysElements).toHaveLength(2);
      expect(getByText(keysToPressElements[1], availableKeysMap.ArrowDown)).toBeInTheDocument();
      expect(keysToPressElements[1]).not.toHaveClass(alignedArrowClassName);
      expect(keysToPressElements[1]).not.toHaveClass(errorArrowClassName);
      expect(pressedKeysElements[1].innerHTML).toBe("");
    })()

    // Нажатие неправильной кнопки
    await user.keyboard("{arrowup}");
    (() => {
      const keysToPressElements = screen.getAllByTestId("key-to-press");
      const pressedKeysElements = screen.getAllByTestId("pressed-key");
      expect(getByText(pressedKeysElements[1], availableKeysMap.ArrowUp)).toBeInTheDocument();
      expect(keysToPressElements[1]).not.toHaveClass(alignedArrowClassName);
      expect(keysToPressElements[1]).toHaveClass(errorArrowClassName);
    })()
  });

  it("три правильных хода приводят к выигрышу", async () => {
    const user = userEvent.setup({ delay: null });

    mockedGetRandomAvailableKey.mockReturnValue("ArrowUp")

    render(<App />);

    await user.click(screen.getByText(/начать игру/i));

    act(() => { jest.advanceTimersByTime(3000) });
    await user.keyboard("{arrowup}");
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    await user.keyboard("{arrowup}");
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    await user.keyboard("{arrowup}");
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    expect(window.alert).toBeCalledWith("Вы выиграли!");
  });

  it("три неправильных хода приводят к проигрышу", async () => {
    const user = userEvent.setup({ delay: null });

    mockedGetRandomAvailableKey.mockReturnValue("ArrowUp")

    render(<App />);

    await user.click(screen.getByText(/начать игру/i));

    act(() => { jest.advanceTimersByTime(3000) });
    await user.keyboard("{arrowdown}");
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    await user.keyboard("{arrowdown}");
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    await user.keyboard("{arrowdown}");
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    expect(window.alert).toBeCalledWith("Вы проиграли!");
  });

  it("бездецйствие три хода приводит к проигрышу", async () => {
    const user = userEvent.setup({ delay: null });

    mockedGetRandomAvailableKey.mockReturnValue("ArrowUp")

    render(<App />);

    await user.click(screen.getByText(/начать игру/i));

    act(() => { jest.advanceTimersByTime(3000) });
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    expect(window.alert).not.toBeCalled();

    act(() => { jest.advanceTimersByTime(3000) });
    expect(window.alert).toBeCalledWith("Вы проиграли!");
  });
});
