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
        this.incomingDamage = 0;
        this.velocity = {
            x: 0,
            y: 0
        }

        this.constOffset = -40 + Math.random() * 50;

        this.projectiles = [];
        this.spawnDelay = delay;
        this.spawnTime = window.performance.now();
        this.target;
        this.lastShot = 0;
        this.shootRadius = 500;

        this.state = "normal";
        this.stateExpiry = 0;
        this.type = type;
        this.position = position;
        
        this.isGonnaBeDead = false;

        this.speed;
        this.damage = 5;
        
        this.maxWaveHeight = 15;
        this.waveHeight = Math.floor(Math.random() * this.maxWaveHeight);
        this.waveDirection = this.waveHeight < this.maxWaveHeight / 2 ? 1 : 0;
        this.waveTime = 50;
        this.waveStep = 1;
        this.lastUpdate = this.spawnTime;
        
        this.hasExploded = false;
        
        this.slowedSprite = img[type + "EnemySlowed"];
        this.strikedSprite = img[type + "EnemyStriked"];

        this.getEnemyStats(type);
        this.maxHealth = this.health;

        this.inverted = false;
        this.lastTime = window.performance.now();

        this.startTime = 0;
        this.pausedTime = 0;
    }

    getEnemyStats(type){
        switch(type){
            case "common":
                this.coinDrop = 2;
                this.health = 15;
                this.points = 5;
                break;
            case "fast":
                this.coinDrop = 3;
                this.health = 10;
                this.points = 10;
                break;
            case "range":
                this.coinDrop = 5;
                this.health = 20;
                this.attackSpeed = 200;
                this.points = 15;
                break;
            case "def":
                this.coinDrop = 10;
                this.health = 30;
                this.points = 20;
                break;
            case "shell":
                this.coinDrop = 15;
                this.health = 20;
                this.points = 25;
                break;
            case "star":
                this.coinDrop = 100;
                this.health = 2000;
                this.attackSpeed = 100;
                this.points = 100;
                break;
            default:
                this.coinDrop = 2;
                this.health = 15;
                this.points = 5;
                break;
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
            case 'star':
                return 1;
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
            case 'star':
                return 0.5;
            default:
                return 1;
        }
    }
    
    changeState(state, expiry) {
        this.state = state;
        this.stateExpiry = window.performance.now() + expiry;
    }
    
    explode() {
        if(this.hasExploded == true) return;
        this.hasExploded = true;
        
        layer3Anim.push(new Effect({
            x: this.position.x + this.constOffset + 50,
            y: this.position.y + this.constOffset - this.waveHeight
        }, 0, 480, img.explosions, 160, 160, 120, 120, 6, 400));

        layer3Anim.push(new Effect({
            x: this.position.x + this.constOffset + 90,
            y: this.position.y + this.constOffset - this.waveHeight - 30
        }, 0, 0, img.coins, 16, 16, 24, 24, 6, 400, 18));
    }

    draw(){
        
        if(this.stateExpiry != 0 && this.stateExpiry < window.performance.now() && !gamePaused) {
            this.stateExpiry = 0;
            this.state = "normal";
        }
        
        // enemy
        let posX = this.position.x + this.constOffset / 2;
        let posY = this.position.y + this.constOffset - this.waveHeight;
        
        switch(this.state) {
            case "normal":
                ctx.drawImage(this.image, posX, posY);
                break;
            case "slowed":
                ctx.drawImage(this.slowedSprite, posX, posY);
                break;
            case "iced":
                ctx.drawImage(this.slowedSprite, posX, posY);
                break;
            case "striked":
                ctx.drawImage(this.strikedSprite, posX, posY);
                layer3Anim.push(new Effect({
                    x: posX + 80,
                    y: posY - 50
                }, 0, 0, img.lightningStrike, 135.5, 252, 20, 80, 7, 200, 35));
                break;
        }

        // health bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(posX + 60, posY - 25, this.width - 120, 10);

        ctx.fillStyle = 'rgb(255, 26, 26)';
        ctx.fillRect(posX + 60, posY - 25, (this.width - 120) * this.health / this.maxHealth, 10);
    }

    update(){

        let msNow = window.performance.now();

        if(gamePaused){
            this.pausedTime = window.performance.now() - this.startTime;
            this.draw();
            return;
        }

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
        
        this.target = null;

        const validTowers = towers.filter((tower) => {
            const xDiff = tower.center.x - this.center.x;
            const yDiff = tower.center.y - this.center.y;
            const distance = Math.hypot(xDiff, yDiff);
            return (distance <= tower.radius + this.radius) && !tower.isGonnaBeDead;
        })

        this.target = validTowers[Math.floor(Math.random() * validTowers.length)];
        
        // const waypoint = waypoints[this.waypointIndex];
        const waypoint = levels[currentLevel].waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
        this.position.x += this.velocity.x * frameMultiplier;
        this.position.y += (this.velocity.y * frameMultiplier);
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

        if (this.type === "range" || this.type === "star" 
        && this.state !== "iced" && this.state !== "slowed") {
            if(this.lastShot + this.attackSpeed * 15 < msNow && this.target 
                && !this.target.isDisabled) {
                projectiles.push(
                    new Projectile({
                        position: {
                            x: this.center.x,
                            y: this.center.y
                        },
                        enemy: this.target,
                        from: this,
                        projectileColor: 'red',
                        moveSpeed: 5
                    })
                )
                this.lastShot = msNow;
            }
        }

        if (this.health <= 0) {
            const index = enemies.indexOf(this);
            if (index !== -1) {
                if(this.type === "star"){
                    $(canvas).css({ filter: "invert(0)"});
                    $(".specialClass").css({ filter: "invert(0)"});
                    this.inverted = false;
                    levelComplete = true;
                    sfx.levelCompleteSound.play();
                    gamePaused = true;
                    showLevelCompleteMenu();
                }
                enemies.splice(index, 1);
                score += this.points;
                coins += this.coinDrop;
                sfx.enemyDeath.play();
                this.explode();
            }
        }
        
        if(msNow - this.lastUpdate > this.waveTime) {
            let waveChange = 0;
            if(this.waveHeight > this.maxWaveHeight * 3/ 4 || this.waveHeight < this.maxWaveHeight / 4) {
                if(this.waveHeight > this.maxWaveHeight * 7 / 8 || this.waveHeight < this.maxWaveHeight / 8) {
                    waveChange = this.waveStep / 4;
                } else {
                    waveChange = this.waveStep / 2;
                }
            } else {
                waveChange = this.waveStep;
            }
            if(this.waveDirection == 0) {
                this.waveHeight -= waveChange;
                if(this.waveHeight < 0) {
                    this.waveHeight = 0;
                    this.waveDirection = 1;
                }
            } else {
                if(this.waveHeight >= this.maxWaveHeight) {
                    this.waveHeight = this.maxWaveHeight;
                    this.waveDirection = 0;
                }
                this.waveHeight += waveChange;
            }
            this.lastUpdate = msNow;
        }
        
        if(this.type === "star"){
            this.starBoss();
        }
    }

    starBoss() {
        let currentTime = window.performance.now();
        let deltaTime = currentTime - this.lastTime;
    
        if (!this.initialDelayElapsed) {
            if (deltaTime >= 3000) {
                this.initialDelayElapsed = true;
                this.lastTime = currentTime;
            }
        } else if (deltaTime >= 1000) {
            this.lastTime = currentTime;
    
            if (this.inverted) {
                shakeCanvas();
                $(canvas).css({ filter: "invert(0)" });
                $(".specialClass").css({ filter: "invert(0)" });
                this.inverted = false;
            } else {
                shakeCanvas();
                $(canvas).css({ filter: "invert(1)" });
                $(".specialClass").css({ filter: "invert(1)" });
                this.inverted = true;
            }
        }
    }
}