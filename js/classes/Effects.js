class Effect{
	constructor(position = {x: 0, y: 0}, ox, oy, _img, oSize, tSize, tFrames, timeout){
		this.position = position;
        
        this.oSize = oSize;
        this.tSize = tSize;
        this.ox = ox;
        this.oy = oy;
        this.targetFrames = tFrames;
        this.timeout = timeout;
        this.startTime = window.performance.now();
        this.lastUpdate = this.startTime;
        this.img = _img;
        this.done = false;
	}
    
    isDone() {
        return !!this.done;
    }

	draw(){
        let diff = window.performance.now() - this.startTime;
        if(diff > this.timeout && this.timeout != 0) {
            this.done = true;
            console.log("effect done");
            return;
        }
        let currentFrame = Math.floor(diff / this.timeout * this.targetFrames);
        if(currentFrame >= this.targetFrames) currentFrame = this.targetFrames - 1;
        //drawImage(image, destX, destY, destWidth, destHeight)
        //drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
        ctx.drawImage(this.img, this.ox + (currentFrame * this.oSize), this.oy, this.oSize, this.oSize, this.position.x, this.position.y, this.tSize, this.tSize);
        console.log();

	}

	update(){
		this.draw();
        if(gamePaused) {
            let diff = window.performance.now() - this.lastUpdate;
            this.startTime += diff;
            return;
        }
        if(this.isDone()) return;
        this.lastUpdate = window.performance.now();
	}
}

var createHitEffect = function(_x, _y) {
    effects.push(new Effect({x: _x ,y: _y}, img.explosions, 160, 80, 6, 200));
}