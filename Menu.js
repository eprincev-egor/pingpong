"use strict";

class Menu extends Events {
    constructor(params) {
        super();
        
        params = f.deepMixin({
            ping: "",
            pong: ""
        }, params);
        
        this.ping = params.ping;
        this.pong = params.pong;
        
        this.initElements();
    }
    
    initElements() {
        this.el = document.createElement("div");
        this.el.className = "PingPongMenu";
        this.el.innerHTML = `
            <div class='PingPongMenu--cell'>
                <div class='PingPongMenu--inner'>
                    <div class='PingPongMenu--leftSide' data-side='left'>
                        <div class='PingPongMenu--item' data-type='keyboard1'>keyboard 1</div>
                        <div class='PingPongMenu--item' data-type='keyboard2'>keyboard 2</div>
                        <div class='PingPongMenu--item' data-type='computerEasy'>computer easy</div>
                        <div class='PingPongMenu--item' data-type='computerMedium'>computer medium</div>
                        <div class='PingPongMenu--item' data-type='computerHard'>computer hard</div>
                    </div>
                    <div class='PingPongMenu--rightSide' data-side='right'>
                        <div class='PingPongMenu--item' data-type='keyboard1'>keyboard 1</div>
                        <div class='PingPongMenu--item' data-type='keyboard2'>keyboard 2</div>
                        <div class='PingPongMenu--item' data-type='computerEasy'>computer easy</div>
                        <div class='PingPongMenu--item' data-type='computerMedium'>computer medium</div>
                        <div class='PingPongMenu--item' data-type='computerHard'>computer hard</div>
                    </div>
                    <div style='clear:both;'></div>
                    <div class='PingPongMenu--play'>
                        play
                    </div>
                </div>
            </div>
        `;
        
        var item;
        
        item = this.el.querySelector(".PingPongMenu--leftSide .PingPongMenu--item[data-type='"+ this.ping +"']");
        item.className = "PingPongMenu--item active";
        
        item = this.el.querySelector(".PingPongMenu--rightSide .PingPongMenu--item[data-type='"+ this.pong +"']");
        item.className = "PingPongMenu--item active";
        
        this.listenTo( this.el, "click", this.onClick.bind(this) );
    }
    
    onClick(e) {
        e.preventDefault();
        
        var target = e.target,
            sideEl = target.parentNode,
            type = target.getAttribute("data-type");
        
        if ( target.className == "PingPongMenu--play" ) {
            this.trigger("play");
            return;
        }
        
        if ( !type ) {
            return;
        }
        
        var items = sideEl.querySelectorAll(".PingPongMenu--item");
        for (var i=0, n=items.length; i<n; i++) {
            var item = items[i];
            item.className = "PingPongMenu--item";
        }
        
        target.className = "PingPongMenu--item active";
        
        if ( sideEl.className == "PingPongMenu--leftSide" ) {
            this.ping = type;
        } else {
            this.pong = type;
        }
    }
    
    show() {
        this.el.style.display = "table";
    }
    
    hide() {
        this.el.style.display = "none";
    }
}