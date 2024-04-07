class Tower extends Sprite {
    constructor({position = {x: 0, y:0}, imageSrc, towerClass}){
        super({position, imageSrc});
        this.width = 192;
        this.height = 192;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2 - 30
        };
        this.projectiles = [];
        this.projectileColor = this.getProjectileColor(towerClass);

        if(towerClass === "Sniper"){
            this.towerDamage = 10;
            this.radius = 700;
            this.projectileSpeed = 10;
        } else{
            this.towerDamage = 5;
            this.radius = 500;
            this.projectileSpeed = 5;
        }

        if(towerClass === "Ice"){
            this.slowedMS = 1500;
            this.slowedMSIncrease = 250;
            this.icedMS = 3000;
        }

        if(towerClass === "Lightning"){
            this.strikedEnemies = 2;
            this.radius = 400;
            this.strikeDamage = 1.2;
        }

        if(towerClass === "Common"){
            this.fireRateTime = 5000;
        }

        this.target = null;
        this.lastShot = 0;
        this.isGonnaBeDead = false;

        this.attackSpeed = this.getAttackSpeed(towerClass);

        this.towerLevel = 1;
        this.towerClass = towerClass;
        this.health = 100;
        this.maxHealth = 100;
        this.towerPrice = 5;
        this.incomingDamage = 0;

        this.upgradeCost = 10;
        this.healthIncrease = 20;
        this.attackSpeedIncrease = 35;
        this.projectileSpeedIncrease = 0.35;

        this.specialTimer = this.getSpecialTimer(towerClass) * 1000;
        // this.specialTimer = 5000;    
        this.specialButton;
        this.timer = 0;

        this.counting = true;
        
        this.levelSprites = [
            imageSrc,
            "sprites/towers/" + towerClass + "-tower-2.png",
            "sprites/towers/" + towerClass + "-tower-3.png",
            "sprites/towers/" + towerClass + "-tower-4.png",
            "sprites/towers/" + towerClass + "-tower-5.png"
        ];
        this.createSpecial();
    }

    getSpecialTimer(towerClass){
        switch(towerClass){
            case "Common":
                return 20;
            case "Ice":
                return 20;
            case "Lightning":
                return 25;
            case "Sniper":
                return 35;
            default:
                return 15;
        }
    }

    getProjectileColor(towerClass){
        switch(towerClass){
            case "Common":
                return 'rgb(150, 150, 150)';
                break;
            case "Ice":
                return 'rgb(50, 170, 255)';
                break;
            case "Lightning":
                return 'rgb(255, 255, 100)';
                break;
            case "Sniper":
                return 'rgb(100, 255, 100)';
                break;
            default:
                return 'rgb(176, 176, 176)';
                break;
        }
    }

    getAttackSpeed(towerClass){
        switch(towerClass){
            case "Common":
                return 250;
                break;
            case "Ice":
                return 280;
                break;
            case "Lightning":
                return 280;
                break;
            case "Sniper":
                return 600;
                break;
            default:
                return 250;
                break;
        }
    }

    draw(){
        super.draw();
        // circle radius
        // ctx.beginPath();
        // ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        // ctx.fill();

        // health bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.position.x + 60, this.position.y - 20, this.width - 120, 10);

        ctx.fillStyle = 'rgb(0, 230, 46)';
        ctx.fillRect(this.position.x + 60, this.position.y - 20, (this.width - 120) * this.health / this.maxHealth, 10);
    }

    createSpecial() {
        const specialButton = document.createElement('button');
        document.querySelector('.specialButtonDiv').appendChild(specialButton);
        specialButton.style.backgroundColor = this.projectileColor;
        specialButton.style.borderColor = this.projectileColor;
        specialButton.style.top = this.position.y + 15;
        specialButton.style.left = this.position.x + 130;
        specialButton.className = "specialClass";
        specialButton.textContent = this.specialTimer / 1000;

        this.specialButton = specialButton;

        specialButton.addEventListener('click', () => {
            if(!gamePaused) handleSpecial(this);
        });

        this.startCountdown(this.specialTimer);
    }

    startCountdown(specialTimer) {
        this.specialButton.disabled = true;
        this.timer = window.performance.now() + specialTimer;
        this.specialButton.style.backgroundColor = this.projectileColor;
    }

    update(){
        this.draw();
        
        if(gamePaused) return;
        let msNow = window.performance.now();
        
        if(this.lastShot + this.attackSpeed * 15 < msNow && this.target && !this.target.isGonnaBeDead) {
            sfx.towerShoot.play();
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target,
                    projectileColor: this.projectileColor,
                    damage: this.towerDamage,
                    moveSpeed: this.projectileSpeed
                })
            )
            this.lastShot = msNow;
        }

        if (this.timer < window.performance.now() && this.counting) {
            this.counting = false;
            this.timer = this.specialTimer;
            this.specialButton.disabled = false;
            this.specialButton.textContent = "S";
            this.specialButton.style.backgroundColor = "rgb(255, 255, 0)";
        }

        if(this.counting){
            this.specialButton.textContent = Math.ceil((this.timer - window.performance.now()) / 1000);
        }
    }

    upgrade(){
        if(coins >= this.upgradeCost){
            if(this.towerLevel < this.levelSprites.length){
                coins -= this.upgradeCost;
                this.health += this.healthIncrease;
                this.maxHealth += this.healthIncrease;
                this.attackSpeed -= this.attackSpeedIncrease;
                this.towerLevel++;
                this.image.src = this.levelSprites[this.towerLevel - 1];
                if(this.towerClass === "Lightning"){
                    this.towerPrice += Math.floor(this.upgradeCost * 0.5);
                    this.upgradeCost += Math.floor(this.upgradeCost * 0.85);
                } else{
                    this.towerPrice += Math.floor(this.upgradeCost * 0.3);
                    this.upgradeCost += Math.floor(this.upgradeCost * 0.65);
                }
                this.towerDamage += 3;
                this.projectileSpeed += this.projectileSpeedIncrease;
                switch(this.towerClass){
                    case 'Common':
                        this.fireRateTime += 500;
                        break;
                    case 'Ice':
                        this.slowedMS += this.slowedMSIncrease;
                        this.icedMS += 500;
                        break;
                    case 'Lightning':
                        this.strikedEnemies++;
                        this.strikeDamage += 0.1;
                        break;
                    case 'Sniper':
                        this.specialTimer -= Math.floor(this.specialTimer * 0.07);
                        break;
                }
            }
        }
    }
}

function createTower({position, towerType}) {
    return new Tower({position, imageSrc: "sprites/towers/" + towerType + "-tower-1.png", towerClass: towerType});
}

function handleSpecial(tower) {
    tower.counting = true;
    switch (tower.towerClass) {
        case "Common":
            previousSpeed = tower.attackSpeed;
            tower.attackSpeed = 20;
            let interval = setInterval(() => {
                tower.attackSpeed = previousSpeed;
                clearInterval(interval);
            }, tower.fireRateTime);
            break;
        case "Ice":
            sfx.towerSlow.play();
            enemies.forEach(enemy => {
                if (enemy.state !== "iced") {
                    enemy.changeState("iced", tower.icedMS);
                }
            });
            break;
        case "Lightning":
            sfx.towerStrike.play();
            enemies.forEach(enemy => {
                enemy.changeState("striked", 200);
                enemy.health -= tower.towerDamage * 1.2;
            });
            break;
        case "Sniper":
            sfx.towerSniper.play();
            enemies.forEach(enemy => {
                enemy.health = 0;
            });
            break;
    }

    tower.startCountdown(tower.timer);
}

