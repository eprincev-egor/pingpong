"use strict";

class Score {
    constructor() {
        this.ping = 0;
        this.pong = 0;
    }
    
    draw(ctx, px) {
        ctx.font = "24px arial";
        ctx.fillStyle = "white";
        
        var scoreText = this.ping + ":" + this.pong;
        ctx.fillText(
            scoreText,
            50 * px - 30,
            4 * px
        );
    }
    
    frame(collision) {
        if ( !collision ) {
            return;
        }
        
        if ( collision.bound == "left" ) {
            this.pong++;
        } else
        if ( collision.bound == "right" ) {
            this.ping++;
        }
    }
}