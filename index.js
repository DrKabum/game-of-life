// Elements
const appElement = document.getElementById('app');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const pauseButton = document.getElementById('pause-btn');
const fastButton = document.getElementById('fast-btn');
const fasterButton = document.getElementById('faster-btn');
const fastestButton = document.getElementById('fastest-btn');
const counterElement = document.getElementById('turn-count');
const infoWindow = document.getElementById('info-window');

// variables
let cells = [];
let cellsNeighboorCount = [];
let isClickPressed = false;
let counter = 0;
let interval = null;

// config
const WIDTH = 50;
const FAST_SPEED = 800;
const FASTER_SPEED = 300;
const FASTEST_SPEED = 100;

const checkAdresses = [
	// defines where the neighboors are
	-WIDTH - 1,
	-WIDTH,
	-WIDTH + 1,
	-1,
	1,
	WIDTH - 1,
	WIDTH,
	WIDTH + 1,
];

// listeners
// -> Mouse controls
document.addEventListener('mousedown', event => {
	if (event.button === 0) {
		isClickPressed = true;
	}
});

document.addEventListener('mouseup', event => {
	if (event.button === 0) {
		isClickPressed = false;
	}
});

// -> control bar
startButton.addEventListener('click', doOneTurn);
resetButton.addEventListener('click', resetGame);
fastButton.addEventListener('click', () => setSpeed(FAST_SPEED));
fasterButton.addEventListener('click', () => setSpeed(FASTER_SPEED));
fastestButton.addEventListener('click', () => setSpeed(FASTEST_SPEED));
pauseButton.addEventListener('click', pauseGame);

// -> get rid of the info window
infoWindow.addEventListener('click', () => infoWindow.classList.add('hidden'));

// game

function createGrid() {
	for (let i = 0; i < WIDTH * WIDTH; i++) {
		const newElement = document.createElement('div');
		newElement.classList.add('cell');

		appElement.appendChild(newElement);
		cells.push(newElement);
	}

	cells.forEach(element => {
		element.addEventListener('mousedown', e =>
			e.currentTarget.classList.toggle('alive')
		);
		element.addEventListener('mouseover', e => {
			if (isClickPressed) {
				e.currentTarget.classList.add('alive');
			}
		});
	});
	counterElement.innerText = counter;
}

function countNeighboors() {
	const prevCount = [...cellsNeighboorCount];
	cells.forEach((_, index) => {
		let neighboors = 0;

		for (let cellIndex of checkAdresses) {
			if (
				cells[index + cellIndex] &&
				!(
					// ignore left cell if on left side
					(
						index % WIDTH === 0 &&
						(cellIndex === -1 ||
							cellIndex === WIDTH - 1 ||
							cellIndex === -WIDTH - 1)
					)
				) &&
				!(
					// and vice versa
					(
						index % WIDTH === WIDTH - 1 &&
						(cellIndex === 1 ||
							cellIndex === WIDTH + 1 ||
							cellIndex === -WIDTH + 1)
					)
				) &&
				cells[index + cellIndex].classList.contains('alive')
			)
				neighboors++;
		}

		cellsNeighboorCount[index] = neighboors;
	});

	// if same count as previous turn, then the game of life is stable and pause the game
	if (
		counter > 0 &&
		prevCount.every((value, index) => value === cellsNeighboorCount[index])
	) {
		pauseGame();
		pauseButton.focus();
	}
}

function checkSurvival() {
	cells.forEach((cell, index) => {
		if (
			cell.classList.contains('alive') &&
			!(cellsNeighboorCount[index] === 2 || cellsNeighboorCount[index] === 3)
		) {
			cell.classList.remove('alive');
		} else if (
			!cell.classList.contains('alive') &&
			cellsNeighboorCount[index] === 3
		)
			cell.classList.add('alive');
	});
}

function gameTurn() {
	countNeighboors();
	checkSurvival();
	counter++;
	counterElement.innerText = counter;
}

function doOneTurn() {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
	gameTurn();
}

function resetGame() {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
	cells = [];
	cellsNeighboorCount = [];
	counter = 0;
	appElement.innerHTML = '';
	createGrid();
}

function setSpeed(speed) {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}

	interval = setInterval(() => {
		gameTurn();
	}, speed);
}

function pauseGame() {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
}

// initiate
createGrid();
