"use strict";
class Effect{
	constructor(position = {x: 0, y: 0}, ox, oy, _img, oWidth, oHeight, tWidth, tHeight, tFrames, timeout = 0, fps = 8){
		this.position = position;
        
        this.tWidth = tWidth;
        this.tHeight = tHeight;
        this.oWidth = oWidth;
        this.oHeight = oHeight;
        this.ox = ox;
        this.oy = oy;
        this.targetFrames = tFrames;
        this.timeout = timeout;
        this.startTime = window.performance.now();
        this.lastUpdate = this.startTime;
        this.img = _img;
        this.done = false;
        this.currentFrame = 0;
        this.fps = fps;
	}
    
    isDone() {
        return !!this.done;
    }

	draw(){
        //drawImage(image, destX, destY, destWidth, destHeight)
        //drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
        ctx.drawImage(this.img, this.ox + (this.currentFrame * this.oWidth), this.oy, this.oWidth, this.oHeight, this.position.x, this.position.y, this.tWidth, this.tHeight);

	}

	update(){
        
        let now = window.performance.now();
        if(gamePaused) {
            this.draw();
            this.startTime += now - this.lastUpdate;
            return;
        }
        
        if(this.isDone()) return;
        
        let diff = now - this.startTime;
        
        if(diff > this.timeout && this.timeout != 0) {
            this.done = true;
            // console.log("effect done");
            return;
        }
        
        if(this.timeout == 0 || (this.fps != 8 && this.fps != 0)) {
            if(now - this.lastUpdate >= 1000 / this.fps) {
                this.currentFrame++;
                if(this.fps != 8 && this.fps != 0 && this.timeout != 0) {
                    if(this.currentFrame >= this.targetFrames)
                        this.currentFrame = this.targetFrames - 1;
                } else {
                    if(this.currentFrame >= this.targetFrames)
                        // looop for ininite fx
                        this.currentFrame = 0;
                }
                this.lastUpdate = now;
            }
        } else {
            this.lastUpdate = now;
            this.currentFrame = Math.floor(diff / this.timeout * this.targetFrames);
            if(this.currentFrame >= this.targetFrames) this.currentFrame = this.targetFrames - 1;
        }
		this.draw();
	}
}

var createHitEffect = function(_x, _y) {
    effects.push(new Effect({x: _x ,y: _y}, img.explosions, 160, 80, 6, 200));
}