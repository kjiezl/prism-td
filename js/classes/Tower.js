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
        //this.frames = 0;

        this.attackSpeed = this.getAttackSpeed(towerClass);

        this.towerLevel = 1;
        this.towerClass = towerClass;
        this.health = 100;
        this.maxHealth = 100;
        this.towerPrice = 5;

        this.upgradeCost = 10;
        this.healthIncrease = 20;
        this.attackSpeedIncrease = 35;
        this.projectileSpeedIncrease = 0.35;

        this.isCooldown = true;
        this.specialTimer = 5;
        this.prevTimer = this.specialTimer;
        this.specialButton;
        
        this.levelSprites = [
            imageSrc,
            "sprites/towers/" + towerClass + "-tower-2.png",
            "sprites/towers/" + towerClass + "-tower-3.png",
            "sprites/towers/" + towerClass + "-tower-4.png",
            "sprites/towers/" + towerClass + "-tower-5.png"
        ];

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

    specialAttack(type){
        switch(type){
            case 'Common':
                this.attackSpeed = 20;
                setInterval(() => {
                    this.attackSpeed = this.fireRateTime;
                }, 5000)
                break;
            default:
                console.log("no special attack");
                break;
        }
    }

    incDamage(enemy) {
        let totalDamage = 0;
        for (const projectile of this.projectiles) {
            if (projectile.enemy === enemy) {
                totalDamage += projectile.damage;
            }
        }
        return totalDamage;
    }

    update(){
        this.draw();

        // console.log(this.isCooldown);
        let msNow = window.performance.now();
        
        // TODO: pls change calculations sa attackspeed
        if(this.lastShot + this.attackSpeed*1.75 < msNow && this.target) {
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

        /*if(this.frames % this.attackSpeed === 0 && this.target){
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
        }*/

        if (this.target && this.incDamage(this.target) >= this.target.health) {
            const remainingEnemies = enemies.filter(enemy => enemy.health > 0);
            if (remainingEnemies.length > 0) {
                this.target = remainingEnemies[0];
            }
        }

        this.frames++;


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
                    case 'Ice':
                        this.slowedMS += this.slowedMSIncrease;
                        this.icedMS += 500;
                    case 'Lightning':
                        this.strikedEnemies++;
                        this.strikeDamage += 0.1;
                }
            }
        }
    }
}

function createTower({position, towerType}) {
    return new Tower({position, imageSrc: "sprites/towers/" + towerType + "-tower-1.png", towerClass: towerType});
}

let countdownIntervals = {};

function startCountdown(tower) {
    if (tower.specialTimer <= 0) {
        clearInterval(countdownIntervals[tower.towerClass]);
        tower.specialButton.textContent = "S";
        tower.specialButton.style.backgroundColor = "rgb(255, 255, 0)";
    } else if (tower.specialTimer === tower.prevTimer) {
        clearInterval(countdownIntervals[tower.towerClass]);
        countdownIntervals[tower.towerClass] = setInterval(() => {
            tower.specialTimer -= 1;
            tower.specialButton.textContent = tower.specialTimer.toString();

            if (tower.specialTimer <= 0) {
                tower.specialButton.textContent = "S";
                tower.specialButton.style.backgroundColor = "rgb(255, 255, 0)";
            }
        }, 1000);
    }
}

function createSpecial() {
    towers.forEach(tower => {
        const specialButton = document.createElement('button');
        document.body.appendChild(specialButton);
        specialButton.style.backgroundColor = tower.projectileColor;
        specialButton.style.borderColor = tower.projectileColor;
        specialButton.style.top = tower.position.y + 15;
        specialButton.style.left = tower.position.x + 130;
        specialButton.className = "specialClass"
        specialButton.textContent = tower.specialTimer;

        tower.specialButton = specialButton;

        specialButton.addEventListener('click', () => {
            handleSpecial(tower);
        });

        startCountdown(tower);
    });
}


function handleSpecial(tower) {
    // if (tower.isCooldown) {
    //     return; 
    // }

    // tower.isCooldown = true;
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
            tower.specialAttack(tower.towerClass);
            enemies.forEach(enemy => {
                if (enemy.state !== "iced") {
                    enemy.state = "iced";
                    let timeout = setTimeout(() => {
                        enemy.state = "normal";
                        clearTimeout(timeout);
                    }, tower.icedMS);
                }
            });
            break;
        case "Lightning":
            sfx.towerStrike.play();
            enemies.forEach(enemy => {
                enemy.state = "striked";
                enemy.health -= tower.towerDamage * 1.2;
                let interval = setInterval(() => {
                    if (enemy.state === "striked") {
                        enemy.state = "normal";
                        clearInterval(interval);
                    }
                }, 100);
            });
            break;
        case "Sniper":
            enemies.forEach(enemy => {
                enemy.health = 0;
            });
            break;
    }

    // setTimeout(() => {
    //     clearInterval(countdownIntervals);
    //     tower.specialTimer = tower.prevTimer + 1;
    // }, 100);
}

