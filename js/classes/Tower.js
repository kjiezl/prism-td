class Tower extends Sprite{
    constructor({position = {x: 0, y:0}}){
        super({position, imageSrc: "sprites/towers/common-tower.png"})
        this.width = 192;
        this.height = 192;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2 - 30
        }
        this.projectiles = []

        this.radius = 500;
        this.target 
        this.frames = 0;
    }

    draw(){
        super.draw();

        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
    }

    update(){
        this.draw();

        if(this.frames % 150 === 0 && this.target){
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target
                })
            )
        }

        this.frames++;
    }
}