"use strict";

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
        this.specialCost = 200;
        this.speedProjectile = false;
        this.showTowerRange = false;
        
        this.hasExploded = false;
        this.isDisabled = false;

        this.pausedTime = 0;
        this.startTime = 0;

        this.levelSprites = [
            imageSrc,
            // "sprites/towers/" + towerClass + "-tower-2.png",
            // "sprites/towers/" + towerClass + "-tower-3.png",
            // "sprites/towers/" + towerClass + "-tower-4.png",
            // "sprites/towers/" + towerClass + "-tower-5.png"
            `sprites/towers/${towerClass}-tower-2.png`,
            `sprites/towers/${towerClass}-tower-3.png`,
            `sprites/towers/${towerClass}-tower-4.png`,
            `sprites/towers/${towerClass}-tower-5.png`
        ];

        this.state = "normal";
        this.stateExpiry = 0;

        this.getTowerStats(towerClass);
        if(towerClass !== "SpeedProjectile") this.createSpecial();
        this.prevProjSpeed = this.projectileSpeed;
        this.health = this.maxHealth;
    }

    getTowerStats(towerClass){
        switch(towerClass){
            case "Common":
                this.projectileColor = 'rgb(150, 150, 150)';
                this.attackSpeed = 200;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
                this.upgradeCost = 10;
                this.specialTimer = 20 * 1000;
                this.towerDamage = 5;
                this.radius = 500;
                this.projectileSpeed = 5;
                this.fireRateTime = 5000;
                this.commonActive = false;
                break;
            case "Ice":
                this.projectileColor = 'rgb(50, 170, 255)';
                this.attackSpeed = 230;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
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
                this.attackSpeed = 230;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
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
                this.attackSpeed = 400;
                this.previousSpeed = this.attackSpeed;
                this.maxHealth = 100;
                this.upgradeCost = 10;
                this.specialTimer = 35 * 1000;
                this.towerDamage = 10;
                this.radius = 700;
                this.projectileSpeed = 10;
                break;
            case "Heal":
                this.maxHealth = 300;
                this.upgradeCost = 70;
                this.specialTimer = 25 * 1000;
                this.specialHealAmount = 70;
                this.towerPrice = 100;
                this.radius = 500;
                break;
            case "AttackBoost":
                this.maxHealth = 300;
                this.upgradeCost = 70;
                this.specialTimer = 25 * 1000;
                this.boostAttackAmount = 3 * 1000;
                this.attackBoost = false;
                this.towerPrice = 100;
                this.radius = 500;
                break;
            case "SpeedProjectile":
                this.maxHealth = 300;
                this.upgradeCost = 70;
                this.towerPrice = 100;
                this.radius = 500;
                break;
        }
    }
    
    explode() {
        if(this.hasExploded == true) return;
        this.hasExploded = true;
        layer2Anim.push(new Effect({
            x: this.position.x,
            y: this.position.y
        }, 0, 480, img.explosions, 160, 160, 192, 192, 6, 700));
    }
    
    healthBoostEffect(){
        layer3Anim.push(new Effect({
            x: this.position.x + 10,
            y: this.position.y + 35
        }, 0, 0, img.specialEffects, 100, 100, 40, 40, 4, 1000, 4));
        setTimeout(() =>{
            layer3Anim.splice(layer3Anim.length - 1, 1);
        }, 2 * 1000)
    }

    attackBoostEffect(){
        layer3Anim.push(new Effect({
            x: this.position.x + 35,
            y: this.position.y + 10
        }, 0, 100, img.specialEffects, 100, 100, 40, 40, 4, 2000, 16));
        setTimeout(() =>{
            layer3Anim.splice(layer3Anim.length - 1, 1);
        }, 2 * 1000)
    }

    strikedEffect(){
        layer3Anim.push(new Effect({
            x: this.center.x - 13,
            y: this.center.y - 100
        }, 0, 0, img.lightningStrike, 135.5, 252, 20, 100, 7, 200, 35));
        setTimeout(() =>{
            layer3Anim.splice(layer3Anim.length - 1, 1);
        }, 2 * 1000)
    }

    draw(){
        super.draw();
        if(this.stateExpiry != 0 && this.stateExpiry < window.performance.now() && !gamePaused) {
            this.stateExpiry = 0;
            this.state = "normal";
        }

        // health bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.position.x + 60, this.position.y - 20, this.width - 120, 10);

        ctx.fillStyle = 'rgb(0, 230, 46)';
        ctx.fillRect(this.position.x + 60, this.position.y - 20, (this.width - 120) * this.health / this.maxHealth, 10);
    }

    showRange(){
        switch(levelParam){
            case 1:
                ctx.beginPath();
                ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.stroke();
                break;
            case 2:
                ctx.beginPath();
                ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.stroke();
                break;
            case 3:
                ctx.beginPath();
                ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
                break;
            case 4:
                ctx.beginPath();
                ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.stroke();
                break;
        }
    }

    createSpecial() {
        var specialButton = $("<button class='specialClass'>");
        specialButton.css({background: this.projectileColor, borderColor: this.projectileColor});
        specialButton.css({top: this.position.y + 15 + "px"});
        specialButton.css({left: this.position.x + 130 + "px"});
        specialButton.html(this.specialTimer / 1000);
        $(".specialButtonDiv").append(specialButton);

        enemies.forEach(enemy => {
            if(enemy.inverted){
                specialButton.css({filter: "invert(1)"});
            }
        })

        this.specialButton = specialButton;

        specialButton.on('click', () => {
            if(!gamePaused) this.handleSpecial();
        });

        this.startCountdown(this.specialTimer);
    }

    handleSpecial(){
        this.counting = true; 
        switch(this.towerClass){
            case "Common":
                this.boostAttack();
                break;
            case "Ice":
                sfx.towerSlow.play();
                enemies.forEach(enemy => {
                    layer3Anim.push(new Effect({
                        x: enemy.position.x + 21,
                        y: enemy.position.y + 21
                    }, 0, 138, img.iced, 148, 138, 150, 150, 4, 250, 16));
                    if (enemy.state !== "iced" && enemy.spawnDelay <= 0) {
                        enemy.changeState("iced", this.icedMS);
                    }
                });
                break;
            case "Lightning":
                sfx.towerStrike.play();
                enemies.forEach(enemy => {
                    if(enemy.spawnDelay <= 0) {
                        enemy.changeState("striked", 200);
                        enemy.health -= this.towerDamage * 1.2;
                    }
                });
                break;
            case "Sniper":
                sfx.towerSniper.play();
                for(let i = 0; i <= enemies.length / 5; i++){
                    if(enemies[i].spawnDelay <= 0){
                        if(enemies[i].type === "star" || enemies[i].type === "lightning" 
                            || enemies[i].type === "scribbles"){
                            enemies[i].health -= 400;
                        } else{
                            enemies[i].health -= 40;
                        }
                    }
                }
                // enemies.forEach(enemy => {
                //     if(enemy.spawnDelay <= 0) {
                //         enemy.health = 0;
                //     }
                // });
                break;
        }
        this.startCountdown(this.timer);
    }

    startCountdown(specialTimer) {
        this.specialButton.attr("disabled", true);
        this.timer = window.performance.now() + specialTimer;
        this.specialButton.css({background: this.projectileColor});
    }

    boostAttack(){
        if(this.towerClass === "AttackBoost"){
            duration = window.performance.now() + this.boostAttackAmount;
            towers.forEach(tower => {
                tower.attackBoost = true;
                if(!tower.isDisabled && tower.towerClass !== "Heal" && tower.towerClass !== "AttackBoost" && tower.towerClass !== "SpeedProjectile"){
                    tower.attackBoostEffect();
                }
            })
        }
        if(this.towerClass === "Common"){
            duration2 = window.performance.now() + this.fireRateTime;
            this.commonActive = true;
        }
        
    }

    update(){
        this.draw();

        if(gamePaused){
            this.pausedTime = window.performance.now() - this.startTime;
            // console.log("pausedtime: " + this.pausedTime + " msnow: " + window.performance.now() + " starttime: " + this.startTime)
            return;
        }

        let msNow = window.performance.now();

        this.target = null;
        const validEnemies = enemies.filter((enemy) => {
            const xDiff = enemy.center.x - this.center.x;
            const yDiff = enemy.center.y - this.center.y;
            const distance = Math.hypot(xDiff, yDiff);
            return (distance <= enemy.radius + this.radius) && !enemy.isGonnaBeDead && enemy.spawnDelay <= 0;
        })
        
        //tower.target = validEnemies[0];
        // this.target = validEnemies[Math.floor(Math.random() * validEnemies.length)]; // randomize target
        
        if (this.towerClass === "Sniper" && validEnemies.some(enemy => enemy.type === "flying")) {
            const flyingEnemies = validEnemies.filter(enemy => enemy.type === "flying");
            this.target = flyingEnemies[Math.floor(Math.random() * flyingEnemies.length)];
        } else {
            const nonFlyingEnemies = validEnemies.filter(enemy => enemy.type !== "flying");
            if (nonFlyingEnemies.length > 0) {
                this.target = nonFlyingEnemies[Math.floor(Math.random() * nonFlyingEnemies.length)];
            }
        }
        

        if((!this.attackBoost && this.lastShot + this.attackSpeed * 15 < msNow) || 
           (this.attackBoost && this.lastShot + 20 * 15 < msNow ||
            !this.commonActive && this.lastShot + this.attackSpeed * 15 < msNow) ||
            (this.commonActive && this.lastShot + 20 * 15 < msNow)) {
            if(this.target && !this.target.isGonnaBeDead &&
               this.towerClass !== "Heal" && this.towerClass !== "AttackBoost" && this.towerClass !== "SpeedProjectile" &&
               !this.isDisabled) {
                sfx.towerShoot.play();
                projectiles.push(
                    new TowerProjectile({
                        position: {
                            x: this.center.x,
                            y: this.center.y
                        },
                        enemy: this.target,
                        from: this,
                        projectileColor: this.projectileColor,
                        damage: this.towerDamage,
                        moveSpeed: this.projectileSpeed
                    })
                );
                this.lastShot = msNow;
            }
        }       

        if (this.health <= 0) {
            const index = towers.indexOf(this);
            if (index !== -1) {
                if(this.towerClass !== "SpeedProjectile"){
                    this.specialButton.hide();
                }
                sfx.towerDestroyed.play();
                towers.splice(index, 1);
                qUpgradeMenu.css("display", "none");
                $(".shopMenu, .upgradeBox").css("display", "none");
            }
        }

        if (this.timer < msNow && this.counting 
            && this.towerClass !== "Heal" && this.towerClass !== "AttackBoost" && this.towerClass !== "SpeedProjectile") {
            this.counting = false;
            this.timer = this.specialTimer;
            this.specialButton.attr("disabled", false);
            this.specialButton.html("S");
            this.specialButton.css({background:"rgb(255, 255, 0)"});
        }

        if(this.timer < msNow && this.counting && this.towerClass === "Heal"){
            towers.forEach(tower => {
                if(!tower.isDisabled){
                    if(tower.health + this.specialHealAmount < tower.maxHealth){
                        tower.health += this.specialHealAmount;
                    } else{
                        tower.health = tower.maxHealth;
                    }
                    tower.healthBoostEffect();
                }
                this.timer = this.specialTimer;
                this.startCountdown(this.timer);
            })
        }

        if(!this.isDisabled && this.timer < msNow && this.counting && this.towerClass === "AttackBoost"){
            this.boostAttack();
            this.timer = this.specialTimer;
            this.startCountdown(this.timer);
        }

        if(duration < msNow && !this.commonActive && this.attackBoost){
            this.attackBoost = false;
        }
        if(duration2 < msNow && this.commonActive){
            this.commonActive = false;
        }

        if(!this.isDisabled && this.counting && this.towerClass !== "SpeedProjectile"){
            this.specialButton.html(Math.ceil((this.timer - msNow) / 1000));
        }

        if(towers.some(tower => tower.towerClass.includes("SpeedProjectile"))){
            this.speedProjectile = true;
        } else{
            this.speedProjectile = false;
        }

        if(this.speedProjectile){
            towers.forEach(tower => {
                if(tower.towerClass === "Sniper"){
                    tower.projectileSpeed = 15;
                } else{
                    tower.projectileSpeed = 10;
                }
            })
        }  else{
            towers.forEach(tower => {
                tower.projectileSpeed = tower.prevProjSpeed;
            })
        }

        this.checkSpecials("Heal", "#specialHealButton", "#specialHealLabel", "Heal Tower");
        this.checkSpecials("AttackBoost", "#attackBoostButton", "#attackBoostLabel", "Attack Boost Tower");
        this.checkSpecials("SpeedProjectile", "#speedProjectileButton", "#speedProjectileLabel", "Speed Projectile Tower");

        if(this.showTowerRange){
            this.showRange();
        }
    }

    checkSpecials(towerClass, buttonId, labelId, labelText) {
        if(towers.some(tower => tower.towerClass.includes(towerClass))) {
            $(buttonId).css("visibility", "hidden");
            $(labelId).text("[unavailable]");
        } else {
            $(buttonId).css("visibility", "visible");
            $(labelId).text(labelText);
        }
    }

    disableTower(){
        layer2Anim.push(new Effect({
            x: this.position.x,
            y: this.position.y
        }, 0, 0, img.towerDisabled, 192, 192, 192, 192, 1, 0, 1));
        this.specialButton.hide();
        this.isDisabled = true;
        this.counting = false;
    }

    enableTower(){
        layer2Anim.splice(0, 1);
        // layer2Anim.splice(0, layer2Anim.length);
        this.specialButton.show();
        this.isDisabled = false;
        this.counting = true; 
        this.timer = this.specialTimer;
        this.startCountdown(this.timer);
    }
    upgrade(){
        if(coins >= this.upgradeCost){
            if(this.towerLevel < this.levelSprites.length){
                coins -= this.upgradeCost;
                this.health += this.healthIncrease;
                this.maxHealth += this.healthIncrease;
                this.attackSpeed -= this.attackSpeedIncrease;
                this.previousSpeed = this.attackSpeed;
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
                this.prevProjSpeed = this.projectileSpeed;
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
let duration2 = 0;

function createTower({position, towerType}) {
    return new Tower({position, imageSrc: "sprites/towers/" + towerType + "-tower-1.png", towerClass: towerType});
}

