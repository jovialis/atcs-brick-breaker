export default class Brick {

	constructor(x, y, initialWear, onBreak) {
		this.x = x;
		this.y = y;

		this.wear = initialWear;

		this.onBreak = onBreak;

		this.uuid = generateUUID();

		this.createElement(true);
	}

	getCanvas() {
		return document.getElementById("canvas");
	}

	getElement() {
		return this.getCanvas().getElementById(this.uuid);
	}

	createElement() {
		// Use correct namespace so it'll work
		const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");

		rectangle.setAttribute("id", this.uuid);
		rectangle.setAttribute("class", `align-col-${(this.x + 1)} align-row-${(this.y + 1)} element-brick`);
		this.getCanvas().appendChild(rectangle);

		layout();

		// Display initial wear
		this.setWearLevel(this.wear);

		return rectangle;
	}

	// Adjust the wear level of blocks
	setWearLevel(newWear) {
		const element = this.getElement();

		element.classList.remove(`wear-level-${this.wear}`);
		element.classList.add(`wear-level-${newWear}`);

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

	deleteElement() {
		const element = this.getElement();
		element.parentNode.removeChild(element);
	}

}