import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import cn from 'classnames';

const KEY_CODE_INPUT_TITLE_MAP = {
	ArrowUp: '↑',
	ArrowDown: '↓',
	ArrowLeft: '←',
	ArrowRight: '→',
};

type KeyCodeInputTitleMapType = keyof typeof KEY_CODE_INPUT_TITLE_MAP;

const LIVES_COUNT = 3;

interface GameState {
	errors: number;
	alignedIndexes: number[];
}

const initialGameState: GameState = {
	errors: 0,
	alignedIndexes: [],
};

const isValidKey = (key: string): key is KeyCodeInputTitleMapType => {
	return Object.keys(KEY_CODE_INPUT_TITLE_MAP).includes(key);
}

function updateState(gameState: GameState, pressedKeys: KeyCodeInputTitleMapType[], keysToPress: KeyCodeInputTitleMapType[]) {
	const pressedKey = pressedKeys[pressedKeys.length - 1];
	const keyShouldBePressed = keysToPress[keysToPress.length - 1];

	if (pressedKey === keyShouldBePressed) {
		return {
			...gameState,
			alignedIndexes: [...gameState.alignedIndexes, keysToPress.length - 1],
		}
	} else {
		return {
			...gameState,
			errors: gameState.errors + 1,
		};
	}
}

function App() {
	const [gameState, setGameState] = useState<GameState>(initialGameState);
	const [pressedKeys, setPressedKeys] = useState<KeyCodeInputTitleMapType[]>([]);
	const [keysToPress, setKeysToPress] = useState<KeyCodeInputTitleMapType[]>([]);
	const isButtonPressedInThisTickRef = useRef(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const pressedKey = e.key;
			if (!isValidKey(pressedKey)) {
				setGameState(prevGameState => ({
					...prevGameState,
					errors: prevGameState.errors + 1,
				}));

				return;
			}

			isButtonPressedInThisTickRef.current = true;
			setPressedKeys(prevPressedKeys => [...prevPressedKeys, pressedKey]);
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		if (!pressedKeys.length) return;
		setGameState(prevGameState => updateState(prevGameState, pressedKeys, keysToPress));
	}, [pressedKeys]);

	useEffect(() => {
		if (gameState.errors >= LIVES_COUNT) {
			confirm('You lost!');
			document.location.reload();
		}
		if (gameState.alignedIndexes.length >= 3) {
			confirm('You won!');
			document.location.reload();
		}
	}, [gameState]);

	useEffect(() => {
		isButtonPressedInThisTickRef.current = false;
		const timeoutId = setTimeout(() => {
			if (keysToPress.length && !isButtonPressedInThisTickRef.current) {
				setGameState(prevGameState => ({
					...prevGameState,
					errors: prevGameState.errors + 1,
				}));
			}

			const badVariableNaming = Object.keys(KEY_CODE_INPUT_TITLE_MAP) as KeyCodeInputTitleMapType[];
			const nextKey = badVariableNaming[Math.floor(Math.random() * 4)];
			setKeysToPress(prevKeysToPress => [...prevKeysToPress, nextKey]);
		}, 3000);

		return () => clearTimeout(timeoutId);
	}, [keysToPress]);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
			</header>
			<section className={'main-container'}>
				<div className="main-container__input">
					<div className="main-container__input-title">Next:</div>
					<div className="main-container__input-values">
						{keysToPress.map((k, i) => (
							<div
								className={cn('main-container__input-value', {
									['main-container__input-value_aligned']:
										gameState.alignedIndexes.indexOf(i) !== -1,
									['main-container__input-value_error']:
									i !== keysToPress.length - 1 && gameState.alignedIndexes.indexOf(i) === -1,
								})}
								key={`next${i}`}
							>
								{' '}
								{KEY_CODE_INPUT_TITLE_MAP[k]}
							</div>
						))}
					</div>
				</div>
				<div className="main-container__input">
					<div className="main-container__input-title">Input:</div>
					<div className="main-container__input-values">
						{pressedKeys.map((k, i) => (
							<div className={'main-container__input-value'} key={`input${i}`}>
								{' '}
								{KEY_CODE_INPUT_TITLE_MAP[k]}
							</div>
						))}
					</div>
				</div>
				<div className="main-container__input">
					<div className="main-container__input-value">
						{Array(LIVES_COUNT - gameState.errors)
							.fill('❤️')
							.map(l => l)}
					</div>
				</div>
			</section>
		</div>
	);
}

export default App;
