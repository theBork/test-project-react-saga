import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import cn from 'classnames';

let nextKey, key;
const keys = [],
	pressedKeys = [];
const KEY_CODE_INPUT_TITLE_MAP = {
	ArrowUp: '↑',
	ArrowDown: '↓',
	ArrowLeft: '→',
	ArrowRigt: '←',
};

const LIVES_COUNT = 3;

const GameState = {
	errors: 0,
	alignedIndexes: [],
};

function updateState(s) {
	if (key === undefined) {
		return;
	}
	if (key === [...keys].reverse()[0]) {
		s.alignedIndexes.push(keys.length - 1);
	} else {
		s.errors++;
	}
	key = undefined;
	if (s.errors > LIVES_COUNT - 1) {
		confirm('You lost!') || document.location.reload();
	}
	if (s.alignedIndexes.length > 2) {
		confirm('You won!') || document.location.reload();
	}
}

function App() {
	const [, setPressedKey] = useState<string>(undefined);
	const [, setNextKey] = useState<number>(undefined);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			key = e.key;
			pressedKeys.push(e.key);
			setPressedKey(e.key);
			updateState(GameState);
		}
		window.addEventListener('keydown', handleKeyDown);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const badVariableNaming = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
			nextKey = badVariableNaming[Math.floor(Math.random() * 4)];
			keys.push(nextKey);
			setNextKey(nextKey);
			updateState(GameState);
		}, 3000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
			</header>
			<section className={'main-container'}>
				<div className="main-container__input">
					<div className="main-container__input-title">Next:</div>
					<div className="main-container__input-values">
						{keys.reverse().map((k, i) => (
							<div
								className={cn('main-container__input-value', {
									['main-container__input-value_aligned']:
										GameState.alignedIndexes.indexOf(i) !== -1,
								})}
								key={1}
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
						{pressedKeys.reverse().map(k => (
							<div className={'main-container__input-value'} key={2}>
								{' '}
								{KEY_CODE_INPUT_TITLE_MAP[k]}
							</div>
						))}
					</div>
				</div>
				<div className="main-container__input">
					<div className="main-container__input-value main-container__input-value_error">
						{Array(LIVES_COUNT - GameState.errors)
							.fill('❤️')
							.map(l => l)}
					</div>
				</div>
			</section>
		</div>
	);
}

export default App;
