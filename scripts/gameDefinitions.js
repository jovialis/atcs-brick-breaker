const canvas = document.getElementById("canvas");
const menu = document.getElementById("menu");
const paddle = document.getElementById("paddle");

const paddleWidth = 13;
const paddleHeight = 4;

const paddleBorder = 2;

function showIngame(flag) {
    if (flag) {
        canvas.classList.add('ingame');
        canvas.classList.remove('menu');

        menu.classList.add('ingame');
        menu.classList.remove('menu');
    } else {
        canvas.classList.remove('ingame');
        canvas.classList.add('menu');

        menu.classList.remove('ingame');
        menu.classList.add('menu');
    }
}

/**
BRICK MANAGEMENT
**/

let bricks = [];

class Brick {

    constructor(x, y, initialWear, onBreak, create) {
        this.x = x;
        this.y = y;

        this.wear = initialWear;

        this.onBreak = onBreak;

        this.uuid = generateUUID();

        if (create) {
            this.createElement(true);
        }
    }

    createElement(doLayout) {
        // Use correct namespace so it'll work
        const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        rectangle.setAttribute("id", this.uuid);
        rectangle.setAttribute("class", `align-col-${ (this.x + 1) } align-row-${ (this.y + 1) } element-brick`);
        canvas.appendChild(rectangle);

        if (doLayout) {
            layout();
        }

        // Display initial wear
        this.setWearLevel(this.wear);

        return rectangle;
    }

    // Adjust the wear level of blocks
    setWearLevel(newWear) {
        const element = this.getElement();

        element.classList.remove(`wear-level-${ this.wear }`);
        element.classList.add(`wear-level-${ newWear }`);

        this.wear = newWear;
    }

    decreaseWearLevel() {
        this.setWearLevel(this.wear - 1);

        if (this.wear == 0) {
            this.didBreak();
        }
    }

    didBreak() {
        const element = this.getElement();        
        this.onBreak(this, element);
    }

    getElement() {
        return canvas.getElementById(this.uuid);
    }

    deleteElement() {
        const element = this.getElement();
        element.parentNode.removeChild(element);
    }

    isOverlapping(element) {

    }

}

function clearBricks() {
    for (const brick of bricks) {
        brick.deleteElement();
    }

    bricks = [];
}

function loadLevel(level) {
    clearBricks();

    const COLS = level.length;
    const ROWS = level[0].length;

    setDimensions(ROWS, COLS);

    for (let col = 0 ; col < level.length ; col++) {
        for (let row = 0 ; row < level[col].length ; row++) {
            const num = Number(level[col][row]);

            if (num === undefined || num == 0) {
                continue;
            }

            const brick = new Brick(row, col, num, handleBrickHit, true);            
            bricks.push(brick);
        }
    }

    layout();
}

function handleBrickHit(brick, element) {
    // TODO: This 
}

/**
PADDLE MANAGEMENT
**/

function setupPaddle() {
    paddle.setAttribute('width', `${ paddleWidth }%`);
    paddle.setAttribute('height', `${ paddleHeight }%`);
}

let paddleListener = null;
function tetherPaddle(attach) {
    if (attach) {
        const listener = (event) => {
            setPaddleLocation(event.clientX);
        };

        paddleListener = listener;
        window.addEventListener('mousemove', listener);
    } else {
        window.removeEventListener('mousemove', paddleListener);
    }
}

function resetPaddleLocation() {
    tetherPaddle(false);
    paddle.setAttribute('x', `${ 50 - ( paddleWidth / 2 ) }%`);
}

function setPaddleLocation(x) {
    let adjustedX = x - canvas.getBoundingClientRect().left;            
    adjustedX -= paddle.getBBox().width / 2;

    // Left side border
    adjustedX = Math.max(paddleBorder, adjustedX);

    // Right side border
    adjustedX = Math.min(adjustedX, canvas.getBoundingClientRect().width - paddleBorder - paddle.getBBox().width);

    paddle.setAttribute('x', adjustedX);
}