import React, { useState, useEffect } from 'react';
import './App.css';

function locationStyle(x, y) {
	return {
		position: 'absolute',
		top: `${y - 4}px`,
		left: `${x - 4}px`,
	};
}

const DEFAULT_COLORS = ['red', 'green', 'blue'];
const DEFAULT_EPSILON = 40.0;
const DEFAULT_MIN_POINTS = 4;

function App() {
	const [wasm, setWasm] = useState(null);
	const [coords, setCoords] = useState({ x: 0, y: 0 });
	const [colors, setColors] = useState(DEFAULT_COLORS);
	const [points, setPoints] = useState([]);
	const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON);
	const [minPoints, setMinPoints] = useState(DEFAULT_MIN_POINTS);

	function colorStyle(cluster) {
		if (cluster < 0) return { background: 'white' };
		return { background: colors[cluster] };
	}

	function epsilonHandler(e) {
		const newEpsilon = parseInt(e.target.value) || 0;
		setEpsilon(newEpsilon);
		setPoints([]);
		setColors(DEFAULT_COLORS);
	}

	function minPointsHandler(e) {
		const newMinPoints = parseInt(e.target.value) || 0;
		setMinPoints(newMinPoints);
		setPoints([]);
		setColors(DEFAULT_COLORS);
	}

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

	function mouseMoveHandler(e) {
		setCoords({
			x: e.clientX,
			y: e.clientY,
		});
	}

	function clusterPoints({ x, y }) {
		// Skip if we haven't loaded the WASM Package or if the point is on the inputs or already exists
		if (!wasm) return false;
		if (x < 136 && y < 46) return false;
		const existingPoint = points.find((point) => point.x === x && point.y === y);
		if (existingPoint) return false;

		// Find the clusters
		const newPoints = [...points, { x, y }];
		const clusters = wasm.cluster({
			points: newPoints.map((point) => [point.x, point.y]),
			epsilon: epsilon || 40,
			minPoints: minPoints || 4,
		});

		// If there are more clusters than how many cluster colors defined, add a random color
		const maxClusterNum = clusters.reduce((maxNum, curNum) => {
			if (curNum > maxNum) return curNum;
			return maxNum;
		}, 0);
		if (maxClusterNum === colors.length) {
			setColors([...colors, `#${Math.floor(Math.random() * 16777215).toString(16)}`]);
		}

		// Lastly, set the cluster points
		setPoints(
			newPoints.map((point, i) => ({
				...point,
				cluster: clusters[i],
			}))
		);
	}

	function renderPoints() {
		return points.map(({ x, y, cluster }) => {
			return (
				<div key={`${x}-${y}`} style={locationStyle(x, y)}>
					<div className="circle" style={colorStyle(cluster)} />
				</div>
			);
		});
	}

	return (
		<div className="App" onMouseMove={mouseMoveHandler} onClick={() => clusterPoints(coords)}>
			<div>
				<input type="text" onChange={epsilonHandler} value={epsilon} />
			</div>
			<div>
				<input type="text" onChange={minPointsHandler} value={minPoints} />
			</div>
			{renderPoints()}
		</div>
	);
}

export default App;
