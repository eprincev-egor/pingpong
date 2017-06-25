"use strict";

class Ball {
    constructor(params) {
        params = f.deepMixin({
            speed: 1.5,
            color: "orange",
            x: 50,
            y: 50,
            r: 3,
            historySize: 50
        }, params);
        
        this.history = [];
        this.speed = params.speed;
        this.historySize = params.historySize;
        this.color = params.color;
        this.vector = this.randomVector();
        this.x = params.x;
        this.y = params.y;
        this.r = params.r;
    }
    
    frameMove(collision) {
        var ball = this;
        
        if ( collision ) {
            if ( collision.ball ) {
                if ( collision.bound == "left" || collision.bound == "right" ) {
                    //ball.vector.x *= -1;
                    ball.x = 50;
                    ball.y = 50;
                    ball.vector = this.randomVector();
                } else {
                    ball.vector.y *= -1;
                }
            } else {
                var dx = collision.diffX,
                    dy = collision.diffY;
                
                if ( dy > 0 ) {
                    ball.vector.y = -1 * Math.abs(ball.vector.x);
                } else
                if ( dy < 0 ) {
                    ball.vector.y = Math.abs(ball.vector.x);
                }
                ball.vector.x *= -1;
            }
        }
        
        ball.x += ball.vector.x * ball.speed;
        ball.y += ball.vector.y * ball.speed;
        
        ball.history.push( ball.y );
        
        if ( ball.history.length > ball.historySize ) {
            ball.history.shift();
        }
    }
    
    frameCollisionBounds() {
        var ball = this;
        // to right or to left
        if ( 
            ball.x <= this.r ||
            ball.x >= 100 - this.r
        ) {
            return {
                ball: ball,
                bound: ball.x <= this.r ? "left" : "right",
                success: false
            };
        }
        
        // to top or to bottom
        if ( 
            ball.y <= this.r ||
            ball.y >= 100 - this.r
        ) {
            return {
                ball: ball,
                bound: ball.y <= this.r ? "top" : "bottom",
                success: false
            };
        }
        
        return false;
    }
    
    draw(ctx, px, collision) {
        var ball = this,
            r = ball.r * px,
            x = ball.x * px,
            y = ball.y * px;
        
        ctx.fillStyle = ball.color;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    randomVector() {
        // на большой скорости сложно играть, если мяч летит в любую сторону
        if ( Math.random() > 0.5 ) {
            return {
                x: 1,
                y: 0.3
            };
        } else {
            return {
                x: -1,
                y: -0.3
            };
        }
        /*
        var rnd = Math.random() * (Math.PI / 2) + Math.PI / 4;
        if ( Math.random() > 0.4 ) {
            rnd += Math.PI;
        }
        
        return {
            x: Math.sin(rnd),
            y: Math.cos(rnd)
        };
        
        */
    }
}