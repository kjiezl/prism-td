class Sprite{
    constructor({position = {x: 0, y: 0}, imageSrc}){
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.constOffset = 0;
    }

    draw(){
        ctx.drawImage(this.image, this.position.x + this.constOffset, this.position.y + this.constOffset);
    }
}