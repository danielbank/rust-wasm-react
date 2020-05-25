import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
	const [wasm, setWasm] = useState(null);

	const loadWasm = async () => {
		try {
			const wasm = await import('dbscan-wasm');
			setWasm(wasm);
		} catch (err) {
			console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
		}
	};

	useEffect(() => {
		loadWasm();
	}, []);

	function clickHandler() {
		if (!wasm) return false;
		const input = {
			points: [
				[1.5, 2.2],
				[1.0, 1.1],
				[1.2, 1.4],
				[0.8, 1.0],
				[3.7, 4.0],
				[3.9, 3.9],
				[3.6, 4.1],
				[10.0, 10.0],
			],
		};
		const output = wasm.cluster(input);
		console.log(output);
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<button type="button" onClick={clickHandler}>
					Test
				</button>
			</header>
		</div>
	);
}

export default App;
