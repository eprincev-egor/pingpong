"use strict";

class App {
    constructor() {
        this.game = new PingPong();
        document.body.appendChild( this.game.el );
        this.game.focus();
        
        window.addEventListener("resize", this.onResize.bind(this));
        this.onResize();
    }
    
    onResize() {
        var windowSize = f.getWindowSize(),
            width = windowSize.width,
            height = windowSize.height;
        
        this.game.setSize(width, height);
    }
}