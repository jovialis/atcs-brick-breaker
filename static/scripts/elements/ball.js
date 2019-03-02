export default class Ball {

	constructor(radius, onHitBottomEdge) {
		this.radius = radius;
		this.onHitBottomEdge = onHitBottomEdge;

        this.resetMovement();

		this.moving = false;

		this.createElement();
	}

	getCanvas() {
		return document.getElementById("canvas");
	}

	getElement() {
		return document.getElementById("ball");
	}

	getPixelRadius() {
		return this.getCanvas().clientHeight * (this.radius / 100);
	}

	createElement() {
		// Use correct namespace so it'll work
		const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

		circle.setAttribute("id", "ball");

		circle.setAttribute("cy", "0");
		circle.setAttribute("cx", "0");

		this.cy = 0;
		this.cx = 0;

		circle.setAttribute('r', `${this.radius}%`);

		this.getCanvas().appendChild(circle);
		layout();

		return circle;
	}
    
    resetMovement() {
        this.cy = 0;
        this.cx = 0;
        
        this.velX = 0.0;
        this.velY = -10.0;
        
        this.speed = 1.0;
        
        this.lastBounce = null;
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

		const element = this.getElement();

		const curX = (this.cx + this.velX * this.speed);
		const curY = (this.cy + this.velY * this.speed);

		this.moveTo(curX, curY);

		if (this.checkBounds()) {
			this.onHitBottomEdge();
		}
	}

	positionOverPaddle(paddle) {
		this.setMoving(false);

		const paddleBBox = paddle.getElement().getBBox();

		const cX = paddleBBox.x + (paddleBBox.width / 2);
		const cY = paddleBBox.y - (this.getElement().getBBox().height * 2);

		this.moveTo(cX, cY);
	}

	moveTo(x, y) {
		const element = this.getElement();

		this.cx = x;
		this.cy = y;

		element.setAttribute('cx', this.cx);
		element.setAttribute('cy', this.cy);
	}

	isOverlapping(element) {
		const selfBounding = this.getElement().getBBox();
		const opposingBounding = element.getBBox();

		if (this.isOverlappingRight(selfBounding, opposingBounding)) {
			this.bounceLeft();
			return true;
		}

		if (this.isOverlappingLeft(selfBounding, opposingBounding)) {
			this.bounceRight();
			return true;
		}

		if (this.isOverlappingBottom(selfBounding, opposingBounding)) {
			this.bounceUp();
			return true;
		}

		if (this.isOverlappingTop(selfBounding, opposingBounding)) {
			this.bounceDown();
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
			if (bottomY > opposing.y && bottomY <= (opposing.y + opposing.height)) {
				return true;
			}
		}

		return false;
	}

	checkBounds() {
		// Return true if we're out of bounds.

		const canvas = this.getCanvas();
		const element = this.getElement();

		// Left side
		if ((this.cx - element.getBoundingClientRect().width / 2) < 0) {
			this.bounceRight();
			return false;
		}

		// Right side
		if ((this.cx + element.getBoundingClientRect().width / 2) >= canvas.getBoundingClientRect().width) {
			this.bounceLeft();
			return false;
		}

		// Top
		if ((this.cy - element.getBoundingClientRect().height / 2) < 0) {
			this.bounceDown();
			return false;
		}

		// If touching bottom
		if ((this.cy + element.getBoundingClientRect().height / 2) >= canvas.getBoundingClientRect().height) {
			this.onHitBottomEdge();
			return true;
		}

		return false;
	}

	modifyXVelocity(velocityAdd) {
		this.velX = Math.min(this.velX + (velocityAdd * this.speed), 5 * this.speed);
	}

	// 1/50 of a second bounce cooldown
	checkBounceCooldown() {
		const curDate = new Date();
		if (this.lastBounce == null || curDate - this.lastBounce > 20) {
			this.lastBounce = curDate;
			return true;
		}
		return false;
	}

	bounceLeft() {
		if (this.checkBounceCooldown()) {
			this.velX = -1 * Math.abs(this.velX)
		}
	}

	bounceRight() {
		if (this.checkBounceCooldown()) {
			this.velX = Math.abs(this.velX);
		}
	}

	bounceUp() {
		if (this.checkBounceCooldown()) {
			this.velY = -1 * Math.abs(this.velY);
		}
	}

	bounceDown() {
		if (this.checkBounceCooldown()) {
			this.velY = Math.abs(this.velY);
		}
	}

}
