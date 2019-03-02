import Brick from './elements/brick.js';
import Paddle from './elements/paddle.js';
import Ball from './elements/ball.js';
import Levels from '../levels/levels.js';

export default class GameManager {

	constructor(onBrickBroken, onNextLevel, onGameWin, onGameLose) {
		this.level = -1;
		this.bricks = [];

		this.onBrickBroken = onBrickBroken;
		this.onNextLevel = onNextLevel;
		this.onGameWin = onGameWin;
		this.onGameLose = onGameLose;

		this.canvas = document.getElementById("canvas");
		this.menu = document.getElementById("menu");

		this.setupElements();
	}

	setupElements() {
		this.paddle = new Paddle(15, 4, 2);
		this.ball = new Ball(2.5, () => {
			this.ballHitBottomEdge()
		});

		this.ball.positionOverPaddle(this.paddle);
	}

	play() {
		this.incrementLevel();
		this.paddle.setTethered(true);
	}

	clearBricks() {
		for (const brick of this.bricks) {
			brick.deleteElement();
		}

		this.bricks = [];
	}

	incrementLevel() {
		this.level += 1;

		if (this.level >= Levels.length) {
			this.onGameWin();
		} else {
			this.loadLevel(this.level);
		}
	}

	loadLevel(num) {
		// Clear level out
		this.paddle.reset();
		this.ball.positionOverPaddle(this.paddle);

		// return;

		this.clearBricks();

		const level = Levels[num];

		const bricks = level.bricks;
		const speed = level.speed;
		const paddleWidth = level.paddleWidth;

		const COLS = bricks.length;
		const ROWS = bricks[0].length;

		// Set layout dimensions
		setDimensions(ROWS, COLS);

		for (let col = 0; col < bricks.length; col++) {
			for (let row = 0; row < bricks[col].length; row++) {
				const num = Number(bricks[col][row]);

				if (num === undefined || num === 0) {
					continue;
				}

				const brick = new Brick(row, col, num, (brick, element) => {
					this.brickBroken(brick, element)
				});
				this.bricks.push(brick);
			}
		}

		this.ball.setSpeed(speed);
		this.paddle.setWidth(paddleWidth);

		layout();

		// Perform any callback functions
		this.onNextLevel(num, level);

		this.startLevel();
	}

	brickBroken(brick, element) {
		brick.deleteElement();

		// Delete brick
		let i = 0;
		for (const cur of this.bricks) {
			if (cur.uuid === brick.uuid) {
				break;
			}
			i += 1;
		}

		this.bricks.splice(i, 1);

		this.onBrickBroken(brick);

		// No bricks left to break so next level
		if (this.bricks.length === 0) {
			this.endLevel();
			this.incrementLevel();
		}
	}

	startLevel() {
		this.ball.setMoving(true);
        this.paddle.setTethered(true);
		this.ballMoveInterval = setInterval(() => {
			this.moveBall()
		}, 20);
	}

	endLevel() {
		this.ball.setMoving(false);
		this.paddle.setTethered(false);
		clearInterval(this.ballMoveInterval);
	}

	moveBall() {
		const ball = this.ball;

		// Move
		ball.move();

		// Check collisions
		if (ball.isOverlapping(this.paddle.getElement())) {
			const velocity = this.paddle.getVelocity();
			if (!(velocity === Infinity || velocity === -Infinity || isNaN(velocity))) {
				ball.modifyXVelocity(this.paddle.getVelocity());
			}
		}

		// Check brick hits.
		for (const brick of this.bricks) {
			if (ball.isOverlapping(brick.getElement())) {
				brick.decreaseWearLevel();
			}
		}
	}

	ballHitBottomEdge() {
        // This method gets called twice for some reason. 
        if (this.ended !== undefined) {
            return;
        }
        
        this.ended = true;
        
		this.endLevel();
		this.onGameLose();
	}

}

