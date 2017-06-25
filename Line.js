"use strict";

class Line {
    constructor(params) {
        params = f.deepMixin({
            speed: 2,
            color: "orange",
            y: 50,
            x: 95,
            width: 2,
            height: 20
        }, params);
        
        this.speed = params.speed;
        this.historySize = params.historySize;
        this.color = params.color;
        this.x = params.x;
        this.y = params.y;
        this.width = params.width;
        this.height = params.height;
    }
    
    frameKeyboard(keyboard) {
        var line = this,
            speed = this.speed;
        
        if ( keyboard.up ) {
            line.y -= speed;
        }
        
        if ( keyboard.down ) {
            line.y += speed;
        }
        
        line.y = Math.max(line.height / 2, line.y);
        line.y = Math.min(100 - line.height / 2, line.y);
    }
    
    frameComputer(ball) {
        var line = this;
        var speed;
        if ( Math.abs(ball.x - line.x) > 50 ) {
            speed = line.speed / 2;
        } else {
            speed = line.speed;
        }
        
        var length = ball.history.length;
        if ( length ) {
            var index;
            if ( length > line.historySize ) {
                index = length - line.historySize;
            } else {
                index = length - 1;
            }
            var y = ball.history[ index ],
                dy = y - line.y;
            
            if ( dy > 0 ) {
                line.y += Math.min( speed, Math.abs(dy) );
            } else {
                line.y -= Math.min( speed, Math.abs(dy) );
            }
        }
        
        line.y = Math.max(line.height / 2, line.y);
        line.y = Math.min(100 - line.height / 2, line.y);
    }
    
    frameCollision(ball) {
        var line = this,
            diffY = line.y - ball.y,
            diffX = line.x - ball.x;
        
        if ( Math.abs(diffX) > line.width/2 + ball.r ) {
            return false;
        }
        if ( Math.abs(diffY) > line.height/2 + ball.r ) {
            return false;
        }
        
        return {
            line: line,
            diffX: diffX,
            diffY: diffY,
            success: true
        };
    }
    
    draw(ctx, px, collision) {
        var line = this,
            color = line.color;
        
        if ( collision && collision.line == line ) {
            color = "green";
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(
            (line.x - line.width / 2) * px,
            (line.y - line.height / 2) * px,
            line.width * px,
            line.height * px
        );
    }
}