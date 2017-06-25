"use strict";

class PingPong extends Events {
    constructor(params) {
        super();
        
        this.params = f.deepMixin({}, params);
        this.px = 0;
        
        this.minBallSpeed = 3;
        this.maxBallSpeed = 10;
        this.step = 0.03;
        
        this.options = {
            ping: "computerEasy",
            pong: "keyboard1"
        };
        
        this.lineParams = {
            ping: {
                x: 5
            },
            pong: {
                x: 95
            },
            keyboard1: {
                brain: "keyboard1",
                speed: 2
            },
            keyboard2: {
                brain: "keyboard2",
                speed: 2
            },
            computerEasy: {
                brain: "computer",
                speed: 1.1
            },
            computerMedium: {
                brain: "computer",
                speed: 1.3
            },
            computerHard: {
                brain: "computer",
                speed: 2
            }
        };
        
        this.initElements();
        this.initBlur();
        this.initMenu();
        this.initKeyboard();
        
        this.score = new Score();
        
        
        this._pause = true;
        this.interval = setInterval(this.frame.bind(this), 30);
    }
    
    initElements() {
        this.el = document.createElement("div");
        this.el.className = "PingPong";
        this.el.style.background = "black";
        this.el.style.position = "relative";
        
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "relative";
        
        this.el.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }
    
    initKeyboard() {
        this.keyboard = new Keyboard();
        
        this.listenTo(this.keyboard, "pause:up", function() {
            this._pause = !this._play;
        }.bind(this));
        
        this.listenTo(this.keyboard, "esc:up", function() {
            this._pause = true;
            this.menu.show();
        }.bind(this));
        
        this.listenTo(this.keyboard, "enter:up", function() {
            this.start({
                ping: this.menu.ping,
                pong: this.menu.pong
            });
        }.bind(this));
    }
    
    initMenu() {
        this.menu = new Menu( this.options );
        this.el.appendChild( this.menu.el );
        
        this.listenTo(this.menu, "play", function() {
            this.start({
                ping: this.menu.ping,
                pong: this.menu.pong
            });
        }.bind(this));
    }
    
    start(options) {
        this.options = options;
        this._pause = false;
        this.menu.hide();
        this.score.clear();
        
        this.ball = new Ball({
            color: this.randomColor()
        });
        
        var pingParams = f.deepMixin(
            this.lineParams[ options.ping ],
            this.lineParams.ping
        );
        this.pingLine = new Line(pingParams);
        
        var pongParams = f.deepMixin(
            this.lineParams[ options.pong ],
            this.lineParams.pong
        );
        this.pongLine = new Line(pongParams);
    }
    
    pause() {
        this._pause = true;
    }
    
    play() {
        this._pause = false;
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
    
    upSpeed() {
        var ball = this.ball,
            ping = this.pingLine,
            pong = this.pongLine;
        
        if ( ball.speed < this.maxBallSpeed ) {
            ball.speed += this.step;
            ping.speed += this.step;
            pong.speed += this.step;
        }
    }
    
    downSpeed() {
        var ball = this.ball,
            ping = this.pingLine,
            pong = this.pongLine;
        
        if ( ball.speed > this.minBallSpeed ) {
            ball.speed -= this.step;
            ping.speed -= this.step;
            pong.speed -= this.step;
        }
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
        
        this.menu.el.style.top = "0";
        this.menu.el.style.left = "0";
        
        if ( width > height ) {
            this.canvas.style.left = (width - height)/ 2 + "px";
            this.menu.el.style.left = (width - height)/ 2 + "px";
            width = height;
        } else {
            this.canvas.style.top = (height - width)/ 2 + "px";
            this.menu.el.style.top = (height - width)/ 2 + "px";
            height = width;
        }
        
        this.px = width / 100;
        
        this.menu.el.style.width = width + "px";
        this.menu.el.style.height = height + "px";
        this.canvas.width = width;
        this.canvas.height = height;
    }
    
    frame() {
        this.canvas.width += 0;
        this.drawBorder();
        
        if ( this._pause ) {
            return;
        }
        
        var ctx = this.ctx,
            px = this.px,
            ping = this.pingLine,
            pong = this.pongLine,
            ball = this.ball,
            tmp1 = ping.frame( ball, this.keyboard ),
            tmp2 = pong.frame( ball, this.keyboard ),
            collisionBounds = ball.frameCollisionBounds(),
            collisionPing = ping.frameCollision( ball ),
            collisionPong = pong.frameCollision( ball ),
            collision = collisionPong || collisionPing || collisionBounds;
        
        if ( collisionBounds ) {
            if ( collisionBounds.bound == "left" || collisionBounds.bound == "right" ) {
                this.playSound("miss");
                
                this.downSpeed();
            } else {
                this.playSound("bound");
            }
        }
        
        if ( collisionPong || collisionPing ) {
            ball.color = this.randomColor();
            this.playSound("bit");
            
            this.upSpeed();
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
    
    drawBorder() {
        var ctx = this.ctx,
            px = this.px,
            $0px = 0.5,
            $100px = 100 * px - 0.5;
        
        ctx.strokeStyle = "white";
        
        // left
        ctx.beginPath();
        ctx.moveTo($0px, $0px);
        ctx.lineTo($0px, $100px);
        ctx.closePath();
        ctx.stroke();
        
        // top
        ctx.beginPath();
        ctx.moveTo($0px, $0px);
        ctx.lineTo($100px, $0px);
        ctx.closePath();
        ctx.stroke();
        
        // right
        ctx.beginPath();
        ctx.moveTo($100px, $0px);
        ctx.lineTo($100px, $100px);
        ctx.closePath();
        ctx.stroke();
        
        // bottom
        ctx.beginPath();
        ctx.moveTo($0px, $100px);
        ctx.lineTo($100px, $100px);
        ctx.closePath();
        ctx.stroke();
    }
}