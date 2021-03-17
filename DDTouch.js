// DDTouch V1.0
class DDTouch {

    constructor(
        canvas,
        onTouch = null,
        onRelease = null, 
        onMove = null,
    ) {
        this.canvas = canvas;
        this._touches = [];

        this.onTouch = onTouch;
        this.onRelease = onRelease;
        this.onMove = onMove;

        // touch
        this.canvas.addEventListener("touchstart", this._touchStart, false);
        this.canvas.addEventListener("touchmove", this._touchMove, false);
        this.canvas.addEventListener("touchend", this._touchEnd, false);

        // mouse
        this.canvas.addEventListener("mousedown", this._mouseDown, false);
        this.canvas.addEventListener("mouseup", this._mouseUp, false);
        this.canvas.addEventListener("mousemove", this._mouseMove, false);
    }

    _touchStart = (evt) => {
        evt.preventDefault();
        const changedTouches = evt.changedTouches;
        for (let i = 0; i < changedTouches.length; i++) {
            const touch = changedTouches[i];
            this._touches.push(this._mapTouch(touch));
            if(this.onTouch) {
                // trigger on touch callback
                this.onTouch(this._mapTouch(touch))
            }
        }
    }

    _touchMove = (evt) => {
        evt.preventDefault();
        const changedTouches = evt.changedTouches;
        for (var i = 0; i < changedTouches.length; i++) {
            const touch = changedTouches[i];
            const index = this._getTouchIndex(touch.identifier);
            this._touches[index] = this._mapTouch(touch);
            if(this.onMove) {
                // trigger on move callback
                this.onMove(this._touches[index])
            }
        }
    }

    _touchEnd = (evt) => {
        evt.preventDefault();
        const changedTouches = evt.changedTouches;

        for (let i = 0; i < changedTouches.length; i++) {
            let index = this._getTouchIndex(changedTouches[i].identifier);
            if(this.onRelease) {
                // trigger on touch callback
                this.onRelease(this._touches[index])
            }
            if (index >= 0) {
                this._touches.splice(index, 1);
            }  
        }
    }

    _getTouchIndex = (id) => {
        for (var i = 0; i < this._touches.length; i++) {
            if (this._touches[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    _mapTouch(touch) {
        return { 
            id : touch.identifier, 
            clientX : touch.clientX,
            clientY : touch.clientY,
            radiusX: touch.radiusX,
            radiusY: touch.radiusY,
        }
    }

    _mouseDown = (evt) => {
        evt.preventDefault();
        const cRect = this.canvas.getBoundingClientRect();  // Gets the CSS positions along with width/height
        const canvasX = Math.round(evt.clientX - cRect.left); // Subtract the 'left' of the canvas from the X/Y
        const canvasY = Math.round(evt.clientY - cRect.top);  // positions to get make (0,0) the top left of the 
        let click = {
            id: 0,
            clientX: canvasX,
            clientY: canvasY,
            radiusX: null,
            radiusY: null,
        }
        this._touches[0] = click;
        if(this.onTouch) {
            // trigger on touch callback
            this.onTouch(this.click)
        }
    }

    _mouseUp = (evt) => {
        evt.preventDefault();
        if(this.onRelease) {
            // trigger on release callback
            this.onRelease(this.click)
        }
        this.clearTouches();
    }

    _mouseMove = (evt) => {
        if(!this._touches[0]) {
            return;
        }

        const cRect = this.canvas.getBoundingClientRect();  // Gets the CSS positions along with width/height
        const canvasX = Math.round(evt.clientX - cRect.left); // Subtract the 'left' of the canvas from the X/Y
        const canvasY = Math.round(evt.clientY - cRect.top);  // positions to get make (0,0) the top left of the canvas
        let click = {
            id: 0,
            clientX: canvasX,
            clientY: canvasY,
            radiusX: null,
            radiusY: null,
        }
        this._touches[0] = click;
        if(this.onMove) {
            // trigger on move callback
            this.onRelease(this.click)
        }
    }

    getTouches = () => {
        return this._touches;
    }

    clearTouches = () => {
        this._touches = [];
    }

}