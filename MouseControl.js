"use strict";

class MouseControl extends Events {
    constructor() {
        super();
        
        this.y = 0;
        
        // modify be outside
        this.px = 0; 
        this.rect = {
            height: 0,
            top: 0
        };
        
        document.addEventListener("mousemove", this.onMove.bind(this));
        document.addEventListener("touchmove", this.onMove.bind(this));
    }
    
    onMove(e) {
        var point = f.getMousePoint(e),
            rect = this.rect,
            px = this.px,
            y;
        
        y = point.y - rect.top;
        y = Math.max(y, rect.height);
        y /= px;
        
        this.y = y;
    }
}