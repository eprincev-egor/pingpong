"use strict";

class Keyboard {
    constructor() {
        this.codes = {
            19: "pause",
            38: "up",
            40: "down"
        };
        
        document.addEventListener("keydown", function(e) {
            var code = this.codes[ e.keyCode ];
            if ( code ) {
                e.preventDefault();
                this[ code ] = true;
            }
        }.bind(this));
        
        document.addEventListener("keyup", function(e) {
            var code = this.codes[ e.keyCode ];
            if ( code ) {
                e.preventDefault();
                delete this[ code ];
            }
        }.bind(this));
    }
    
}