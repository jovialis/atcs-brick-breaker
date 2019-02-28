import Brick from './brick';
import Paddle from './paddle';
import Ball from './ball';
import Levels from '../levels/levels';

export default class GameManager {

    constructor(onBrickBroken, onNextLevel, onGameWin, onGameLose) {
        this.level = -1;
        this.blocks = [];

        this.onBrickBroken = onBrickBroken;
        this.onNextLevel = onNextLevel;
        this.onGameWin = onGameWin;
        this.onGameLose = onGameLose;

        this.canvas = document.getElementById("canvas");
        this.menu = document.getElementById("menu");
    }

    setup() {
        this.paddle = new Paddle(13, 4, 2);
        this.ball = new Ball();

        this.incrementLevel();
    }

    play() {
        this.setup();

        this.paddle.setTethered(true);
    }

    clearBricks() {
        for (const brick of bricks) {
            brick.deleteElement();
        }

        this.bricks = [];
    }

    incrementLevel() {
        this.level += 1;

        if (this.level >= Levels.length) {
            this.onGameEnd();
        } else {
            this.loadLevel(this.level);
        }
    }

    loadLevel(num) {
        // Clear level out
        this.paddle.reset();
        this.clearBricks();

        const level = Levels[num];

        const COLS = level.length;
        const ROWS = level[0].length;

        // Set layout dimensions
        setDimensions(ROWS, COLS);

        for (let col = 0 ; col < level.length ; col++) {
            for (let row = 0 ; row < level[col].length ; row++) {
                const num = Number(level[col][row]);

                if (num === undefined || num === 0) {
                    continue;
                }

                const brick = new Brick(row, col, num, this.brickBroken);
                this.bricks.push(brick);
            }
        }

        layout();

        // Perform any callback functions
        this.onNextLevel(this.level);
    }

    brickBroken(brick, element) {
        brick.deleteElement();
        this.bricks.remove(brick);

        this.onBrickBroken(brick);

        // No bricks left to break so next level
        if (this.bricks.length === 0) {
            this.incrementLevel();
        }
    }

}

