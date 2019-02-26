import levels from '../levels/levels.js';

// Current level settings
let curLevel = -1;

function prepareForNextLevel() {
    // Setup display
    showIngame(true);
    
    // Start paddle 
    setupPaddle();
    resetPaddleLocation();

    // Initial settings
    tetherPaddle(false);

    curLevel += 1;

    if (curLevel >= levels.length) {
        showGameOver(true);
    } else {
        loadLevel(levels[curLevel]);
    }
}

function showGameOver(win) {
    
}

// Setup first level
prepareForNextLevel();
showIngame(true);

