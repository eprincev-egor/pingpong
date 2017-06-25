"use strict";

class Keyboard extends Events {
    constructor() {
        super();
        
        this.codes = {
            19: "pause",
            38: "up1",
            40: "down1",
            // w
            87: "up2",
            // s
            83: "down2",
            
            27: "esc",
            13: "enter"
        };
        
        document.addEventListener("keydown", function(e) {
            var code = this.codes[ e.keyCode ];
            if ( code ) {
                e.preventDefault();
                this[ code ] = true;
                this.trigger(code + ":down", e);
            }
        }.bind(this));
        
        document.addEventListener("keyup", function(e) {
            var code = this.codes[ e.keyCode ];
            if ( code ) {
                e.preventDefault();
                delete this[ code ];
                this.trigger(code + ":up", e);
            }
        }.bind(this));
    }
    
}