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

        this.attackSpeed = 250;
        // this.attackSpeed = 100;

        this.health = 100;
        this.maxHealth = 100;
    }

    draw(){
        super.draw();

        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();

        // health bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.position.x + 60, this.position.y - 20, this.width - 120, 10);

        ctx.fillStyle = 'rgb(0, 230, 46)';
        ctx.fillRect(this.position.x + 60, this.position.y - 20, (this.width - 120) * this.health / this.maxHealth, 10);
    }

    update(){
        this.draw();

        if(this.frames % this.attackSpeed === 0 && this.target){
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