"use strict";

class Line {
    constructor(params) {
        params = f.deepMixin({
            brain: "keyboard1",
            speed: 2,
            color: "orange",
            y: 50,
            x: 95,
            width: 2,
            height: 20,
            historySize: 3
        }, params);
        
        this.brain = params.brain;
        this.speed = params.speed;
        this.historySize = params.historySize;
        this.color = params.color;
        this.x = params.x;
        this.y = params.y;
        this.width = params.width;
        this.height = params.height;
    }
    
    frame(ball, keyboard) {
        if ( this.brain.indexOf("computer") === 0 ) {
            this.frameComputer(ball);
        } else
        if ( this.brain == "keyboard1" ) {
            this.frameKeyboard(ball, {
                up: keyboard.up1,
                down: keyboard.down1
            });
        }
        if ( this.brain == "keyboard2" ) {
            this.frameKeyboard(ball, {
                up: keyboard.up2,
                down: keyboard.down2
            });
        }
    }
    
    frameKeyboard(ball, keyboard) {
        var line = this,
            speed = this.speed;
        
        if ( keyboard.up ) {
            line.y -= speed;
            if ( this.frameCollision(ball) ) {
                line.y += speed;
            }
        }
        
        if ( keyboard.down ) {
            line.y += speed;
            if ( this.frameCollision(ball) ) {
                line.y -= speed;
            }
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
                dy = y - line.y,
                step;
            
            if ( dy > 0 ) {
                step = Math.min( speed, Math.abs(dy) );
            } else {
                step = -Math.min( speed, Math.abs(dy) );
            }
            
            line.y += step;
            if ( this.frameCollision(ball) ) {
                line.y -= step;
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