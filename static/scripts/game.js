import GameManager from './gameManager.js';

let curLevel;
let curLevelName;
let curBricksBroken = 0;

let highestLevel;
let highestLevelName;
let totalBricksBroken;
let gamesWon;
let gamesLost;

let didWin = false;
let didLose = false;

function loadStats() {
    highestLevel = Number(localStorage.getItem('highestLevel'));
    highestLevelName = localStorage.getItem('highestLevelName');
    totalBricksBroken = localStorage.getItem('totalBricksBroken');
    gamesWon = localStorage.getItem('won');
    gamesLost = localStorage.getItem('lost');
}

function saveHighestLevel(num, name) {
    highestLevel = num;
    highestLevelName = name;

    localStorage.setItem('highestLevel', num);
    localStorage.setItem('highestLevelName', name);
}

function incrementTotalBricksBroken() {
    totalBricksBroken++;
    localStorage.setItem('totalBricksBroken', totalBricksBroken);
}

function incrementWins() {
    gamesWon++;
    localStorage.setItem('won', gamesWon);
}

function incrementLosses() {
    gamesLost++;
    localStorage.setItem('lost', gamesLost);
}

function onBrickBreak(brick) {
    curBricksBroken++;
    incrementTotalBricksBroken();

    refreshHud();
}

function onNextLevel(num, level) {
    curLevel = num;
    curLevelName = level.name;

    if (curLevel > highestLevel) {
        saveHighestLevel(num, level.name);
    }

    refreshHud();
}

function onGameWin() {
    didWin = true;
    incrementWins();

    refreshHud();
}

function onGameLose() {
    didLose = true;
    incrementLosses();

    refreshHud();
}

loadStats();

const manager = new GameManager(onBrickBreak, onNextLevel, onGameWin, onGameLose);
manager.play();

function refreshHud() {
    // Level name
    document.getElementById('current-level-name').innerHTML = `${ curLevelName } (${ ( curLevel + 1 ) })`;
    document.getElementById('highest-level-name').innerHTML = `${ (highestLevelName ? highestLevelName : curLevelName) } (${ ( (highestLevel ? highestLevel : curLevel) + 1 ) })`;

    // Bricks
    document.getElementById('current-bricks-broken').innerHTML = `${ curBricksBroken }`;
    document.getElementById('total-bricks-broken').innerHTML = `${ (totalBricksBroken ? totalBricksBroken : 0 ) }`;

    // Stats
    document.getElementById('total-games-won').innerHTML = `${ (gamesWon ? gamesWon : 0) }`;
    document.getElementById('total-games-lost').innerHTML = `${ (gamesLost ? gamesLost : 0) }`;

    if (didWin) {
        document.getElementById("won").classList.add('enabled');
    }

    if (didLose) {
        document.getElementById("lost").classList.add('enabled');
    }
}