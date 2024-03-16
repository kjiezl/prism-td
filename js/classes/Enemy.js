class Enemy extends Sprite{
    constructor({position = {x: 0, y: 0}, type = ''}){
        const spriteSrc = `sprites/enemies/${type}-enemy.png`;
        super({position, imageSrc: spriteSrc});

        this.width = 192;
        this.height = 192;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = 45;
        this.health = this.getInitHealth(type);
        this.maxHealth = this.getInitHealth(type);
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = this.getSpeed(type);

        this.projectiles = []
        this.target;
        this.frames = 0;
        this.shootRadius = 500;
        this.isRange = type === 'range';
        // this.attackDamage = this.getAttackDamage(type);
    }

    getInitHealth(type){
        switch(type){
            case 'common':
                return 15;
                break;
            case 'fast':
                return 10;
                break;
            case 'range':
                return 20;
                break;
            case 'def':
                return 30;
                break;
            case 'shell':
                return 20;
                break;
            default:
                return 15;
                break;
        }
    }

    getSpeed(type){
        switch(type){
            case 'common':
                return 1;
                break;
            case 'fast':
                return 1.5;
                break;
            case 'range':
                return 1;
                break;
            case 'def':
                return 0.5;
                break;
            case 'shell':
                return 1;
                break;
            default:
                return 1;
                break;
        }
    }

    draw(){
        // enemy
        super.draw();

        // health bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.position.x + 60, this.position.y - 25, this.width - 120, 10);

        ctx.fillStyle = 'rgb(255, 26, 26)';
        ctx.fillRect(this.position.x + 60, this.position.y - 25, (this.width - 120) * this.health / this.maxHealth, 10);
    }

    update(){
        this.draw();

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if(Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) 
        < Math.abs(this.velocity.x * 3) 
        && Math.abs(Math.round(this.center.y) - Math.round(waypoint.y))
        < Math.abs(this.velocity.y * 3)
        && this.waypointIndex < waypoints.length - 1){
            this.waypointIndex++;
        }

        if (this.isRange) {
            if(this.frames % 350 === 0 && this.target){
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
}