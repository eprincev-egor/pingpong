"use strict";

class PingPong {
    constructor(params) {
        this.params = f.deepMixin({}, params);
        this.px = 0;
        
        this.initElements();
        this.initBlur();
        
        this.score = new Score();
        this.keyboard = new Keyboard();
        
        this.ball = new Ball({
            color: this.randomColor()
        });
        
        this.pingLine = new Line({
            speed: 1.1,
            historySize: 3,
            x: 5
        });
        this.pongLine = new Line({
            speed: 2,
            historySize: 5,
            x: 95
        });
        
        this._pause = false;
        this.interval = setInterval(this.frame.bind(this), 30);
    }
    
    pause() {
        this._pause = true;
    }
    
    play() {
        this._pause = false;
    }
    
    initElements() {
        this.el = document.createElement("div");
        this.el.className = "PingPong";
        this.el.style.background = "black";
        this.el.style.position = "relative";
        
        this.canvas = document.createElement("canvas");
        this.canvas.style.border = "1px solid white";
        this.canvas.style.position = "relative";
        
        this.el.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }
    
    initBlur() {
        this._focus = false;
        
        document.addEventListener("mousedown", function(e) {
            var isInner = e.target === this.el || e.target === this.canvas;
            
            if ( this._focus && !isInner ) {
                this.blur();
            } else
            if ( !this._focus && isInner ) {
                this.focus();
            }
        }.bind(this));
    }
    
    focus() {
        this._focus = true;
    }
    
    blur() {
        this._focus = false;
    }
    
    setSize(width, height) {
        this.top = height * 0.05;
        
        this.el.style.width = width + "px";
        this.el.style.height = height + "px";
        
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        
        if ( width > height ) {
            this.canvas.style.left = (width - height)/ 2 + "px";
            width = height;
        } else {
            this.canvas.style.top = (height - width)/ 2 + "px";
            height = width;
        }
        
        this.px = width / 100;
        
        this.canvas.width = width;
        this.canvas.height = height;
    }
    
    frame() {
        this.canvas.width += 0;
        
        var ctx = this.ctx,
            px = this.px,
            ping = this.pingLine,
            pong = this.pongLine,
            ball = this.ball,
            tmp1 = ping.frameComputer( ball ),
            tmp2 = pong.frameKeyboard( ball, this.keyboard ),
            collisionBounds = ball.frameCollisionBounds(),
            collisionPing = ping.frameCollision( ball ),
            collisionPong = pong.frameCollision( ball ),
            collision = collisionPong || collisionPing || collisionBounds;
        
        if ( collisionBounds ) {
            if ( collisionBounds.bound == "left" || collisionBounds.bound == "right" ) {
                this.playSound("miss");
                
                ball.speed -= ball.step;
                ping.speed -= ball.step;
                pong.speed -= ball.step;
            } else {
                this.playSound("bound");
            }
        }
        
        if ( collisionPong || collisionPing ) {
            ball.color = this.randomColor();
            this.playSound("bit");
            
            ball.speed += ball.step;
            ping.speed += ball.step;
            pong.speed += ball.step;
        }
        
        ball.frameMove( collision );
        this.score.frame( collision );
        
        ping.draw( ctx, px, collision );
        pong.draw( ctx, px, collision );
        ball.draw( ctx, px, collision );
        
        this.score.draw( ctx, px );
    }
    
    randomColor() {
        var r = Math.round( Math.random() * 256 ),
            g = Math.round( Math.random() * 256 ),
            b = Math.round( Math.random() * 256 );
        
        return `rgb( ${r}, ${g}, ${b} )`;
    }
    
    playSound(src) {
		var sound = document.createElement("audio");
        sound.autoplay = "autoplay";
        sound.style.display = "none";
        
        sound.innerHTML = '<source src="sounds/'+ src +'.mp3" />';

        setTimeout(function () {
            sound.remove();
        }, 3000);
	}
}