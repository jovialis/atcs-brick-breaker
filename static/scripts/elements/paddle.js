/**
 PADDLE MANAGEMENT
 **/

class PaddleLocation {

	constructor(x, time) {
		this.x = x;
		this.time = time;
	}

}

export default class Paddle {

	constructor(widthPercent, heightPercent, borderWidth) {
		this.prevLoc = new PaddleLocation(0, new Date());
		this.curLoc = new PaddleLocation(0, new Date());

		this.paddleWidth = widthPercent;
		this.paddleHeight = heightPercent;
		this.borderWidth = borderWidth;

		this.createElement();
	}

	getCanvas() {
		return document.getElementById("canvas");
	}

	getElement() {
		return document.getElementById("paddle");
	}

	createElement() {
		// Use correct namespace so it'll work
		const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");

		rectangle.setAttribute("id", "paddle");
		rectangle.setAttribute("y", "95%");

		rectangle.setAttribute('width', `${this.paddleWidth}%`);
		rectangle.setAttribute('height', `${this.paddleHeight}%`);

		this.getCanvas().appendChild(rectangle);
		layout();

		return rectangle;
	}

	setWidth(width) {
		this.paddleWidth = width;
		this.getElement().setAttribute('width', `${this.paddleWidth}%`);
	}

	setTethered(flag) {
		if (flag) {
			// Only set one interval at a time
			if (this.paddleListener !== null) {
				return;
			}

			const listener = (event) => {
				this.setLocation(event.clientX);
			};

			window.addEventListener('mousemove', listener);
			this.paddleListener = listener;
		} else {
			window.removeEventListener('mousemove', this.paddleListener);
			this.paddleListener = null;
		}
	}

	reset() {
		this.setTethered(false);
		this.getElement().setAttribute('x', `${50 - (this.paddleWidth / 2)}%`);
	}

	setLocation(x) {
		const element = this.getElement();

		let adjustedX = x - this.getCanvas().getBoundingClientRect().left;
		adjustedX -= element.getBBox().width / 2;

		// Left side border
		adjustedX = Math.max(this.borderWidth, adjustedX);

		// Right side border
		adjustedX = Math.min(adjustedX, this.getCanvas().getBoundingClientRect().width - this.borderWidth - element.getBBox().width);

		element.setAttribute('x', adjustedX);

		this.prevLoc = this.curLoc;
		this.curLoc = new PaddleLocation(adjustedX, new Date());
	}

	getVelocity() {
		const curLoc = this.curLoc;
		const prevLoc = this.prevLoc;

		const deltaX = curLoc.x - prevLoc.x;
		const deltaT = (curLoc.time - prevLoc.time);

		return deltaX / deltaT;
	}

}