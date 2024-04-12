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
        this.target = null;
        this.lastShot = 0;
        this.isGonnaBeDead = false;
        this.towerLevel = 1;
        this.towerClass = towerClass;
        this.towerPrice = 5;
        this.incomingDamage = 0;
        this.healthIncrease = 20;
        this.specialButton;
        this.timer = 0;
        this.attackSpeedIncrease = 35;
        this.projectileSpeedIncrease = 0.35;  
        this.counting = true;
        
        this.hasExploded = false;
        
        this.levelSprites = [
            imageSrc,
            "sprites/towers/" + towerClass + "-tower-2.png",
            "sprites/towers/" + towerClass + "-tower-3.png",
            "sprites/towers/" + towerClass + "-tower-4.png",
            "sprites/towers/" + towerClass + "-tower-5.png"
        ];

        this.getTowerStats(towerClass);
        if(towerClass !== "SpeedProjectile") this.createSpecial();
    }

    getTowerStats(towerClass){
        switch(towerClass){
            case "Common":
                this.projectileColor = 'rgb(150, 150, 150)';
                this.attackSpeed = 250;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
                this.health = this.maxHealth;
                this.upgradeCost = 10;
                this.specialTimer = 20 * 1000;
                this.towerDamage = 5;
                this.radius = 500;
                this.projectileSpeed = 5;
                this.fireRateTime = 5000;
                break;
            case "Ice":
                this.projectileColor = 'rgb(50, 170, 255)';
                this.attackSpeed = 280;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
                this.health = this.maxHealth;
                this.upgradeCost = 10;
                this.specialTimer = 20 * 1000;
                this.towerDamage = 5;
                this.radius = 500;
                this.projectileSpeed = 5;
                this.slowedMS = 1500;
                this.slowedMSIncrease = 250;
                this.icedMS = 3000;
                break;
            case "Lightning":
                this.projectileColor = 'rgb(255, 255, 100)';
                this.attackSpeed = 280;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
                this.health = this.maxHealth;
                this.upgradeCost = 10;
                this.specialTimer = 25 * 1000;
                this.towerDamage = 5;
                this.radius = 500;
                this.projectileSpeed = 5;
                this.strikedEnemies = 2;
                this.radius = 400;
                this.strikeDamage = 1.2;
                break;
            case "Sniper":
                this.projectileColor = 'rgb(100, 255, 100)';
                this.attackSpeed = 600;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
                this.health = this.maxHealth;
                this.upgradeCost = 10;
                this.specialTimer = 35 * 1000;
                this.towerDamage = 10;
                this.radius = 700;
                this.projectileSpeed = 10;
                break;
            case "Heal":
                this.maxHealth = 300;
                this.health = this.maxHealth;
                this.upgradeCost = 40;
                this.specialTimer = 30 * 1000;
                this.specialHealAmount = 50;
                break;
            case "AttackBoost":
                this.maxHealth = 300;
                this.health = this.maxHealth;
                this.upgradeCost = 40;
                this.specialTimer = 40 * 1000;
                this.boostAttackAmount = 3 * 1000;
                break;
            case "SpeedProjectile":
                this.maxHealth = 300;
                this.health = this.maxHealth;
                this.upgradeCost = 40;
                this.speedProjectile = true;
                break;
        }
    }
    
    explode() {
        if(this.hasExploded == true) return;
        this.hasExploded = true;
        layer3Anim.push(new Effect({
            x: this.position.x,
            y: this.position.y
        }, 0, 480, img.explosions, 160, 160, 192, 192, 6, 700));
    }
        

    draw(){
        super.draw();
        // attack radius
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

    boostAttack(){
        towers.forEach(tower => {
            duration = window.performance.now() + this.boostAttackAmount;
            tower.attackSpeed = 20;
        })
    }

    update(){
        this.draw();
        
        if(gamePaused) return;
        let msNow = window.performance.now();
        
        if(this.lastShot + this.attackSpeed * 15 < msNow && this.target && !this.target.isGonnaBeDead
             && this.towerClass !== "Heal" && this.towerClass !== "AttackBoost" && this.towerClass !== "SpeedProjectile") {
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

        if (this.health <= 0) {
            const index = towers.indexOf(this);
            if (index !== -1) {
                if(this.towerClass !== "SpeedProjectile"){
                    this.specialButton.style.display = "none";
                }
                sfx.towerDestroyed.play();
                towers.splice(index, 1);
                qUpgradeMenu.css("display", "none");
                $(".shopMenu").css("display", "none");
                $(".upgradeBox").css("display", "none");
            }
        }

        if (this.timer < msNow && this.counting 
            && this.towerClass !== "Heal" && this.towerClass !== "AttackBoost" && this.towerClass !== "SpeedProjectile") {
            this.counting = false;
            this.timer = this.specialTimer;
            this.specialButton.disabled = false;
            this.specialButton.textContent = "S";
            this.specialButton.style.backgroundColor = "rgb(255, 255, 0)";
        }

        if(this.timer < msNow && this.counting && this.towerClass === "Heal"){
            towers.forEach(tower => {
                if(tower.health + this.specialHealAmount < tower.maxHealth){
                    tower.health += this.specialHealAmount;
                } else{
                    tower.health = tower.maxHealth;
                }
                this.timer = this.specialTimer;
                this.startCountdown(this.timer);
            })
        }

        if(this.timer < msNow && this.counting && this.towerClass === "AttackBoost"){
            this.boostAttack();
            this.timer = this.specialTimer;
            this.startCountdown(this.timer);
        }

        if(duration < msNow){
            this.attackSpeed = this.previousSpeed;
        }

        if(this.counting && this.towerClass !== "SpeedProjectile"){
            this.specialButton.textContent = Math.ceil((this.timer - msNow) / 1000);
        }

        if(this.speedProjectile){
            towers.forEach(tower => {
                if(tower.towerClass === "Sniper"){
                    tower.projectileSpeed = 15;
                } else{
                    tower.projectileSpeed = 10;
                }
            })
        } else{
            towers.forEach(tower => {
                if(tower.towerClass === "Sniper"){
                    tower.projectileSpeed = 10;
                } else{
                    tower.projectileSpeed = 5;
                }
            })
        }

        this.checkSpecials();
    }

    // needs work
    checkSpecials(){
        towers.forEach(tower =>{
            if(tower.towerClass === "Heal"){
                document.querySelector("#specialHealButton").disabled = true;
            } else{
                document.querySelector("#specialHealButton").disabled = false;
            }

            if(tower.towerClass === "AttackBoost"){
                document.querySelector("#attackBoostButton").disabled = true;
            } else{
                document.querySelector("#attackBoostButton").disabled = false;
            }

            if(tower.towerClass === "SpeedProjectile"){
                document.querySelector("#speedProjectileButton").disabled = true;
            } else{
                document.querySelector("#speedProjectileButton").disabled = false;
            }
        })
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
                    case "Common":
                        this.fireRateTime += 500;
                        break;
                    case "Ice":
                        this.slowedMS += this.slowedMSIncrease;
                        this.icedMS += 500;
                        break;
                    case "Lightning":
                        this.strikedEnemies++;
                        this.strikeDamage += 0.1;
                        break;
                    case "Sniper":
                        this.specialTimer -= Math.floor(this.specialTimer * 0.07);
                        break;
                    case "Heal":
                        this.specialTimer -= 2000;
                        break;
                    case "AttackBoost":
                        this.boostAttackAmount += 750;
                        break;
                }
            }
        }
    }
}

let duration = 0;

function createTower({position, towerType}) {
    return new Tower({position, imageSrc: "sprites/towers/" + towerType + "-tower-1.png", towerClass: towerType});
}

function handleSpecial(tower) {
    tower.counting = true;
    switch (tower.towerClass) {
        case "Common":
            previousSpeed = tower.attackSpeed;
            tower.attackSpeed = 20;
            setTimeout(() => {
                tower.attackSpeed = previousSpeed;
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

