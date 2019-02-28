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

        rectangle.setAttribute('width', `${ this.paddleWidth }%`);
        rectangle.setAttribute('height', `${ this.paddleHeight }%`);

        this.getCanvas().appendChild(rectangle);
        layout();

        return rectangle;
    }

    setTethered(flag) {
        if (flag) {
            const listener = (event) => {
                setPaddleLocation(event.clientX);
            };

            this.paddleListener = listener;
            window.addEventListener('mousemove', listener);
        } else {
            window.removeEventListener('mousemove', this.paddleListener);
        }
    }

    reset() {
        this.setTethered(false);
        this.getElement().setAttribute('x', `${ 50 - ( this.paddleWidth / 2 ) }%`);
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
        
        this.prevLoc = this.curX;
        this.curLoc = new PaddleLocation(adjustedX, new Date());
    }
    
    getVelocity() {
        const curLoc = this.curLoc;
        const prevLoc = this.prevLoc;
        
        const deltaX = curLoc.x - prevLoc.x;
        const deltaT = (curLoc.time - prevLoc.time) / 100; // Hundredths of a second
        
        return deltaX / deltaT;
    }

}