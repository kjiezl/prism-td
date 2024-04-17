class Projectile{
	constructor({position = {x: 0, y: 0}, enemy, from, projectileColor, damage, moveSpeed}){
		this.position = position;
		this.velocity = {
			x: 0,
			y: 0
		}
		this.enemy = enemy;
        this.from = from;
		this.radius = 10;
		this.moveSpeed = moveSpeed;
		this.projectileColor = projectileColor;

		this.trailLength = 40;
		this.trailOpacity = 0.5;
		this.trailColor = projectileColor;
		this.maxTrailWidth = 20;
		this.damage = damage;
        if(this.enemy.health - this.enemy.incomingDamage - this.damage <= 0) {
            this.enemy.isGonnaBeDead = true;
        }
        this.enemy.incomingDamage += this.damage;
        this.hasExploded = false;
	}
    
    enemyHit() {
        this.enemy.incomingDamage -= this.damage;
    }
    
    explode() {
        if(this.hasExploded == true) return;
        this.hasExploded = true;
        var _p = this;
        var _i = projectiles.findIndex(p =>
            p.position.x == _p.position.x && p.position.y == _p.position.y
        );
        projectiles.splice(_i, 1);
    }

	draw(){

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.projectileColor;
		ctx.fill();

		for (let i = 1; i <= 3; i++) {
			const trailLengthMultiplier = i * 2;
			const trailOpacityMultiplier = 1 - i * 0.2;
			const trailWidth = this.maxTrailWidth * (1 - i / 4);
			ctx.beginPath();
			ctx.moveTo(this.position.x, this.position.y);
			ctx.lineTo(this.position.x - this.velocity.x * trailLengthMultiplier, this.position.y - this.velocity.y * trailLengthMultiplier);
			ctx.strokeStyle = `rgba(255, 255, 255, ${this.trailOpacity * trailOpacityMultiplier})`;
			ctx.lineWidth = trailWidth;
			ctx.lineCap = 'round';
			ctx.stroke();
		}
	}

	update(){
		this.draw();
        if(gamePaused) return;

        const angle = Math.atan2(this.enemy.center.y - this.position.y + this.enemy.constOffset, 
            this.enemy.center.x - this.position.x + this.enemy.constOffset);

        this.velocity.x = Math.cos(angle) * this.moveSpeed;
        this.velocity.y = Math.sin(angle) * this.moveSpeed;

        this.position.x += this.velocity.x * frameMultiplier;
        this.position.y += this.velocity.y * frameMultiplier;
        
        
        const xDiff = this.enemy.center.x - this.position.x;
        const yDiff = this.enemy.center.y - this.position.y;
        const distance = Math.hypot(xDiff, yDiff);

        if(distance <= 50){
            this.enemy.health -= 5;
            // this.enemy.health -= this.damage;
            if (this.enemy.health <= 0) {
                const towerIndex = towers.findIndex((tower) => {
                    return this.enemy === tower;
                });
            
                if (towerIndex > -1) {
                    const tower = towers[towerIndex];
                    const tileIndex = placementTiles.findIndex(tile =>
                        tile.position.x === tower.position.x && tile.position.y === tower.position.y
                    );
                    if (tileIndex > -1) {
                        placementTiles[tileIndex].isOccupied = false;
                    }
                }
                this.enemy.explode();
            }
            layer3Anim.push(new Effect({
                x: this.enemy.position.x,
                y: this.enemy.position.y
            }, 0, 0, img.explosions, 160, 160, 128, 128, 6, 200));
            this.explode();
        }
        
	}
}

class TowerProjectile extends Projectile {
    update() {
        this.draw();
        if(gamePaused) return;

        const angle = Math.atan2(this.enemy.center.y - this.position.y + this.enemy.constOffset, 
            this.enemy.center.x - this.position.x + this.enemy.constOffset);

        this.velocity.x = Math.cos(angle) * this.moveSpeed;
        this.velocity.y = Math.sin(angle) * this.moveSpeed;

        this.position.x += this.velocity.x * frameMultiplier;
        this.position.y += this.velocity.y * frameMultiplier;
        
        
        const xDiff = this.enemy.center.x - this.position.x + this.enemy.constOffset/2;
        const yDiff = this.enemy.center.y - this.position.y + this.enemy.constOffset/2; // include y offset from spawning
        const distance = Math.hypot(xDiff, yDiff);

        if(distance <= this.enemy.radius + this.radius - 15){
            this.enemyHit();
            let eX = this.enemy.position.x > this.position.x ? 32 : -32;
            let eY = this.enemy.position.y > this.position.y ? 32 : -32;
            switch(this.from.towerClass){
                case "Ice":
                    if(this.enemy.health > 0){
                        sfx.towerSlow.play();
                    }
                    layer3Anim.push(new Effect({
                        x: this.enemy.position.x + 21,
                        y: this.enemy.position.y + 21
                    }, 0, 138, img.iced, 148, 138, 150, 150, 4, 250, 16));
                    if(this.enemy.state === "iced"){
                        this.enemy.changeState("iced", 200);
                    } else{
                        this.enemy.changeState("slowed", this.from.slowedMS);
                    }
                    layer3Anim.push(new Effect({
                        x: (this.position.x + eX),
                        y: (this.position.y + eY)
                    }, 0, 320, img.explosions, 160, 160, 64, 64, 6, 200));
                    this.enemy.health -= this.from.towerDamage;
                    break;
                case "Lightning":
                    sfx.towerStrike.play();
                    this.enemy.changeState("striked", 200);
                    const otherEnemies = enemies.filter(e => e !== this.enemy);
                    otherEnemies.sort((a, b) => {
                        const distA = Math.hypot(this.enemy.center.x - a.center.x, this.enemy.center.y - a.center.y);
                        const distB = Math.hypot(this.enemy.center.x - b.center.x, this.enemy.center.y - b.center.y);
                        return distA - distB;
                    });

                    otherEnemies.slice(0, this.from.strikedEnemies).forEach(enemy => {
                        enemy.health -= (this.from.towerDamage / 2); 
                        enemy.changeState("striked", 200);
                    });
                    layer3Anim.push(new Effect({
                        x: (this.position.x + eX),
                        y: (this.position.y + eY)
                    }, 0, 0, img.explosions, 160, 160, 64, 64, 6, 200));
                    this.enemy.health -= this.from.towerDamage;
                    break;
                default:
                    layer3Anim.push(new Effect({
                        x: (this.position.x + eX),
                        y: (this.position.y + eY)
                    }, 0, 160, img.explosions, 160, 160, 64, 64, 6, 200));
                    this.enemy.health -= this.from.towerDamage;
            }
            // if(this.enemy.health <= 0){
            //     const enemyIndex = enemies.findIndex((enemy) => {
            //         return this.enemy === enemy;
            //     });

                // if(enemyIndex > -1){
                //     enemies.splice(enemyIndex, 1);
                //     sfx.enemyDeath.play();
                //     coins += this.enemy.coinDrop;
                //     score += this.enemy.points;
                // }
                // this.enemy.explode();
            // }
            
            super.explode();
        }
    }
}