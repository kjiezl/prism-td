class Enemy extends Sprite{
    constructor({position = {x: 0, y: 0}, type = '', delay = 0}){
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
        this.incomingDamage = 0;
        this.velocity = {
            x: 0,
            y: 0
        }

        // this.speed = this.getSpeed(type);
        this.constOffset = -40 + Math.random() * 50;

        this.projectiles = [];
        this.spawnDelay = delay;
        this.spawnTime = window.performance.now();
        this.target;
        //this.frames = 0;
        this.lastShot = 0;
        this.shootRadius = 500;
        this.isRange = type === 'range';
        this.coinDrop = this.getCoinDrop(type);
        // this.slowedSpeed = this.getSlowedSpeed(type);

        this.state = "normal";
        this.stateExpiry = 0;
        this.type = type;
        this.position = position;
        
        this.isGonnaBeDead = false;

        this.speed;

        this.slowedSprite = new Image();
        this.slowedSprite.src = `sprites/enemies/${type}-enemy-slowed.png`;

        this.strikedSprite = new Image();
        this.strikedSprite.src = `sprites/enemies/${type}-enemy-striked1.png`;

        // this.attackDamage = this.getAttackDamage(type);
        this.iceCount = 1;
    }

    getCoinDrop(type){
        switch(type){
            case 'common':
                return 2;
            case 'fast':
                return 3;
            case 'range':
                return 5;
            case 'def':
                return 7;
            case 'shell':
                return 15;
            default:
                return 2;
        }
    }

    getInitHealth(type){
        switch(type){
            case 'common':
                return 15;
            case 'fast':
                return 10;
            case 'range':
                return 20;
            case 'def':
                return 30;
            case 'shell':
                return 20;
            default:
                return 15;
        }
    }

    getSpeed(type){
        switch(type){
            case 'common':
                return 2;
            case 'fast':
                return 2.5;
            case 'range':
                return 2;
            case 'def':
                return 1.5;
            case 'shell':
                return 2;
            default:
                return 2;
        }
    }

    getSlowedSpeed(type){
        switch(type){
            case 'common':
                return 1;
            case 'fast':
                return 1.5;
            case 'range':
                return 1;
            case 'def':
                return 0.5;
            case 'shell':
                return 1;
            default:
                return 1;
        }
    }
    
    changeState(state, expiry) {
        this.state = state;
        this.stateExpiry = window.performance.now() + expiry;
    }

    draw(){
        
        if(this.stateExpiry != 0 && this.stateExpiry < window.performance.now()) {
            this.stateExpiry = 0;
            this.state = "normal";
        }
        
        // enemy
        if(this.state === "normal"){
            super.draw();
        } else if(this.state === "slowed"){
            ctx.drawImage(this.slowedSprite, this.position.x + this.constOffset, this.position.y + this.constOffset);
        } else if(this.state === "iced"){
            ctx.drawImage(this.slowedSprite, this.position.x + this.constOffset, this.position.y + this.constOffset);
        }
        else if(this.state === "striked"){
            ctx.drawImage(this.strikedSprite, this.position.x + this.constOffset, this.position.y + this.constOffset);
        }

        // health bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.position.x + 60 + this.constOffset, this.position.y - 25 + this.constOffset, this.width - 120, 10);

        ctx.fillStyle = 'rgb(255, 26, 26)';
        ctx.fillRect(this.position.x + 60 + this.constOffset, this.position.y - 25 + this.constOffset, (this.width - 120) * this.health / this.maxHealth, 10);
    }
    
    checkTargets(towers) {
        
    }

    update(){
        
        let msNow = window.performance.now();
        if(this.spawnDelay > 0 && !gamePaused) {
            this.spawnDelay -= msNow - this.spawnTime;
            this.spawnTime = msNow;
            return;
        } else if(gamePaused && this.spawnDelay > 0) {
            this.spawnTime = msNow;
            return;
        } else {
            this.draw();
        }
        if(gamePaused) return;

        if(this.state === "slowed"){
            this.speed = this.getSlowedSpeed(this.type);
        } else if(this.state === "iced"){
            this.speed = 0;
        }
        else{
            this.speed = this.getSpeed(this.type);
        }

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
        this.position.x += this.velocity.x * frameMultiplier;
        this.position.y += this.velocity.y * frameMultiplier;
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
            let msNow = window.performance.now();
            if(this.lastShot + 3000 < msNow && this.target) {
                this.projectiles.push(
                    new Projectile({
                        position: {
                            x: this.center.x,
                            y: this.center.y
                        },
                        enemy: this.target,
                        projectileColor: 'red',
                        moveSpeed: 5
                    })
                )
                this.lastShot = msNow;
            }
            /*if(this.frames % 350 === 0 && this.target){
                this.projectiles.push(
                    new Projectile({
                        position: {
                            x: this.center.x,
                            y: this.center.y
                        },
                        enemy: this.target,
                        projectileColor: 'red',
                        moveSpeed: 5
                    })
                )
            }
    
            this.frames++;*/
        }

        if (this.health <= 0) {
            const index = enemies.indexOf(this);
            if (index !== -1) {
                enemies.splice(index, 1);
            }
        }
    }
}