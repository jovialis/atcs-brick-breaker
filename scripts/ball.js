export default class Ball {

    constructor(radius, onHitBottomEdge) {
        this.radius = radius;
        this.onHitBottomEdge = onHitBottomEdge;

        this.speed = 1.0;

        this.velX = 1.0;
        this.velY = 1.0;

        this.cy = 0;
        this.cx = 0;

        this.moving = false;

        this.createElement();
    }

    getCanvas() {
        return document.getElementById("canvas");
    }

    getElement() {
        return document.getElementById("ball");
    }

    createElement() {
        // Use correct namespace so it'll work
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("id", "ball");

        circle.setAttribute("cy", "0");
        circle.setAttribute("cx", "0");

        this.cy = 0;
        this.cx = 0;

        circle.setAttribute('r', `${ this.radius }%`);

        this.getCanvas().appendChild(circle);
        layout();

        return circle;
    }

    setMoving(flag) {
        this.moving = flag;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    move() {
        if (!this.moving) {
            return;
        }
        
        this

        const element = this.getElement();

        const curX = (this.cx + this.velX) * this.speed;
        const curY = (this.cy + this.velY) * this.speed;

        if (!this.checkBounds(curX, curY)) {
            this.moveTo(curX, curY);
        }        
    }

    positionOverPaddle(paddle) {
        this.setMoving(false);

        const element = this.getElement();

        const paddleBBox = paddle.getBBox();

        const cX = paddleBBox.x + (paddleBBox.width / 2);
        const cY = paddleBBox.y - (this.radius * this.getCanvas().clientHeight) - 1;

        this.moveTo(cX, cY);
    }

    moveTo(x, y) {
        const element = this.getElement();

        this.cx = x;
        this.cy = y;

        element.setAttribute('cx', cX);
        element.setAttribute('cy', cY);
    }

    isOverlapping(element, doBounce) {
        const selfBounding = this.getElement().getBBox();
        const opposingBounding = element.getBBox();

        if (this.isOverlappingLeft(selfBounding, opposingBounding) || this.isOverlappingRight(selfBounding, opposingBounding)) {
            if (doBounce) {
                this.bounceHorizontal();
            }
            return true;
        }

        if (this.isOverlappingTop(selfBounding, opposingBounding) || this.isOverlappingBottom(selfBounding, opposingBounding)) {
            if (doBounce) {
                this.bounceVertical();
            }
            return true;
        }

        return false;
    }

    isOverlappingLeft(self, opposing) {
        //   0
        //  X 0
        //   0

        const leftX = self.x;
        const leftY = self.y + (self.height / 2);

        // If our x coordinate is within the shape
        if (leftX > opposing.x && leftX <= (opposing.x + opposing.width)) {
            // If our y coordinate is within the shape
            if (leftY > opposing.y && leftY < (opposing.y + opposing.height)) {
                return true;
            }
        }

        return false;
    }

    isOverlappingRight(self, opposing) {
        //   0
        //  0 X
        //   0

        const rightX = self.x + self.width;
        const rightY = self.y + (self.height / 2);

        // If x coordinate is within opposing shape.
        if (rightX >= opposing.x && rightX < (opposing.x + opposing.width)) {
            // If y coordinate is within opposing shape
            if (rightY > opposing.y && rightY < (opposing.y + opposing.height)) {
                return true;
            }
        }

        return false;
    }

    isOverlappingTop(self, opposing) {
        //   X
        //  0 0
        //   0

        const topX = self.x + (self.width / 2);
        const topY = self.y;

        if (topX > opposing.x && topX < (opposing.x + opposing.width)) {
            if (topY >= opposing.y && topY < (opposing.y + opposing.height)) {
                return true;
            }
        }

        return false;
    }

    isOverlappingBottom(self, opposing) {
        //   0
        //  0 0
        //   X

        const bottomX = self.x + (self.width / 2);
        const bottomY = self.y + self.height;

        if (bottomX > opposing.x && bottomX < (opposing.x + opposing.width)) {
            if (bottomY > opposing.height && bottomY <= (opposing.y + opposing.height)) {
                return true;
            }
        }

        return false;
    }
    
    checkBounds(x, y) {
        // Return true if we're out of bounds.
        
        const canvas = this.getCanvas();
        

    }

    modifyXVelocity(velocityAdd) {
        this.velX += velocityAdd;
    }

    bounceVertical() {
        this.velY *= -1;
    }

    bounceHorizontal() {
        this.velX *= -1;
    }

}
