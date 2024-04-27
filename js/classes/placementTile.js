class placementTile{
    constructor({position = {x: 0, y: 0}}){
        this.position = position;
        // this.size = 192;
        this.sizeX = canvas.width / levels[currentLevel].tileSize[0];
        this.sizeY = canvas.height / levels[currentLevel].tileSize[1];
        this.color = 'rgba(255, 255, 255, 0)';
        this.occupied = false;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.sizeX, this.sizeY)
    }

    update(mouse){
        this.draw();

        if(mouse.x >= this.position.x && mouse.x <= this.position.x + this.sizeX &&
            mouse.y >= this.position.y && mouse.y <= this.position.y + this.sizeY 
            && !gamePaused){
            this.color = 'rgba(255, 255, 0, 0.25)';
        } else{
            this.color = 'rgba(255, 255, 255, 0)';
        }
    }
}