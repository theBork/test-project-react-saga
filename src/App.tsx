import React, { useEffect } from 'react';
import cn from "classnames";
import useAppSelector from "./hooks/useAppSelector";
import useAppDispatch from "./hooks/useAppDispatch";
import { keyPress, processNewStep, startGame } from "./store/reducers/game";
import { availableKeysMap } from "./constants/keys";
import logo from './logo.svg';
import './App.css';

function App() {
	const dispatch = useAppDispatch();
	const gameState = useAppSelector(state => state.game);
	const { isListenKeyPress, livesAmount, keyChain, gameStatus } = gameState;

	useEffect(() => {
		if (!isListenKeyPress) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			const pressedKey = e.key;
			dispatch(keyPress(pressedKey));
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isListenKeyPress]);

	useEffect(() => {
		if (gameStatus === "win") return alert("Вы выиграли!");
		if (gameStatus === "lose") return alert("Вы проиграли!");
		if (gameStatus !== "progress") return;
		const intervalId = setInterval(() => {
			dispatch(processNewStep());
		}, 3000);

		return () => clearInterval(intervalId);
	}, [gameStatus]);

	if (gameStatus === "pending") {
		return <button onClick={() => dispatch(startGame())}>Начать игру</button>
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
			</header>
			<section className={'main-container'}>
				<div className="main-container__input">
					<div className="main-container__input-title">Next:</div>
					<div className="main-container__input-values">
						{keyChain.map((k, i) => (
							<div
								key={`next${i}`}
								className={cn('main-container__input-value', {
									['main-container__input-value_aligned']: k.keyToPress === k.pressedKey,
									['main-container__input-value_error']: i === keyChain.length - 1
										? k.pressedKey && k.keyToPress !== k.pressedKey
										: k.keyToPress !== k.pressedKey,
								})}
								data-testid="key-to-press"
							>
								{availableKeysMap[k.keyToPress]}
							</div>
						))}
					</div>
				</div>
				<div className="main-container__input">
					<div className="main-container__input-title">Input:</div>
					<div className="main-container__input-values">
						{keyChain.map((k, i) => (
							<div key={`input${i}`} className={'main-container__input-value'} data-testid="pressed-key">
								{k.pressedKey ? availableKeysMap[k.pressedKey] : ""}
							</div>
						))}
					</div>
				</div>
				<div className="main-container__lives">
					<div className="main-container__lives-item">
						{Array(livesAmount)
							.fill('❤️')
							.map(l => l)}
					</div>
				</div>
			</section>
		</div>
	);
}

export default App;
