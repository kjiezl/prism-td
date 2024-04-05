class Sprite{
    constructor({position = {x: 0, y: 0}, imageSrc}){
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(){
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

class Anim{
    constructor({imageSrc, frameX, frameY, position = {x: 0, y: 0}}){
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameX = frameX;
        this.frameY = frameY;
        this.position = position;
    }

    draw(){
        // ctx.drawImage(this.image, 192 * this.frameX, 192 * this.frameY, )
    }

    anim(){

    }
}