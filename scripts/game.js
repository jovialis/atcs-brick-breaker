import GameManager from './gameManager';

function onBrickBreak(brick) {
    
}

function onNextLevel(level) {
    
}

function onGameWin() {
    
}

function onGameLose() {
    
}

const manager = new GameManager(onBrickBreak, onNextLevel, onGameWin, onGameLose);
manager.play();