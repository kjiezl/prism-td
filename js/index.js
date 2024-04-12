"use strict";

const canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// canvas.width = window.innerWidth;
canvas.width = 1920;
canvas.height = canvas.width / 2;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let qCoins = $("#coins");
let qUpgradeMenu = $(".upgradeMenu");

let sfx = {
    towerPlace: new Howl({
        src: ['sfx/tower-place.mp3'],
        volume: 0.7
    }),
    towerUpgrade: new Howl({
        src: ['sfx/tower-upgrade.mp3'],
        volume: 0.5
    }),
    towerShoot: new Howl({
        src: ['sfx/tower-shoot.wav']
    }),
    towerDestroyed: new Howl({
        src: ['sfx/tower-destroyed.mp3'],
        volume: 0.4
    }),
    towerStrike: new Howl({
        src: ['sfx/tower-strike.mp3'],
        volume: 0.7
    }),
    towerSlow: new Howl({
        src: ['sfx/tower-slow.mp3'],
        volume: 0.3
    }),
    towerSniper: new Howl({
        src: ['sfx/tower-sniper.mp3'],
        volume: 0.1
    }),
    enemyDeath: new Howl({
        src: ['sfx/enemy-death.mp3'],
        volume: 0.1
    }),
    baseHit: new Howl({
        src: ['sfx/base-hit.mp3'],
        volume: 0.5
    })
}

let bgm = {
    bgm1: new Howl({
        src: ['bgm/level1-bgm1.mp3'],
        loop: true,
        volume: 0.7
    }),
    gameOver: new Howl({
        src: ['bgm/gameover.mp3'],
        volume: 0.3
    })
}

var files = {
    images: {
        level1: "sprites/map/level1.png",
        portal: "sprites/gameobj/portal1.png",
        flowers: "sprites/gameobj/flowers.png",
        base: "sprites/gameobj/base.png",
        explosions: "sprites/effects/explosions.png",
        commonEnemy: "sprites/enemies/common-enemy.png",
        fastEnemy: "sprites/enemies/fast-enemy.png",
        rangeEnemy: "sprites/enemies/range-enemy.png",
        commonEnemyStriked: "sprites/enemies/common-enemy-striked1.png",
        fastEnemyStriked: "sprites/enemies/fast-enemy-striked1.png",
        rangeEnemyStriked: "sprites/enemies/range-enemy-striked1.png",
        commonEnemySlowed: "sprites/enemies/common-enemy-slowed.png",
        fastEnemySlowed: "sprites/enemies/fast-enemy-slowed.png",
        rangeEnemySlowed: "sprites/enemies/range-enemy-slowed.png",
        alien1: "sprites/gameobj/alien-1-34x50.png",
    }
};

var img = {};
var loaded = 0;
Object.keys(files.images).forEach(key => {
    //img[key] = new Image();
    img[key] = new Image();
    img[key].onload = () => {
        loaded++;
    };
    img[key].src = files.images[key];
});


var placementTilesData2D = [];

for(let i = 0; i < placementTilesData.length; i += 10){
    placementTilesData2D.push(placementTilesData.slice(i, i + 20))
}

var placementTiles = [];

placementTilesData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 9){
            placementTiles.push(new placementTile({
                position: {
                    x: x * canvas.width / 10,
                    y: y * canvas.width / 10
                }
            }))
        }
    })
});

var enemies = [];
var layer1Anim = [];
var layer3Anim = [];

let currentWave = 0;
let currentLevel = 0;

function spawnEnemies(){
    let wave = levels[currentLevel].waves[currentWave];

    let spawnCount = 0;
    for(let enemyType in wave){
        spawnCount += wave[enemyType];
    }

    for(let i = 1; i <= spawnCount; i++){
        const enemyTypes = Object.keys(wave);
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        enemies.push(
            new Enemy({
                position: {x: (waypoints[0].x - 200) - Math.random() * 100, y: (waypoints[0].y - 96)},
                type: randomType,
                delay: 500 * i + Math.random() * 3000
            })
        );
    }
}

function startNextWave(){
    currentWave++;
    if(currentWave < levels[currentLevel].waveCount){
        spawnEnemies();
    } else{
        currentLevel++;
    }
}

// function spawnEnemies(spawnCount){
//     for(let i = 1; i <= spawnCount; i++){
//         const enemyTypes = ['common', 'fast', 'range'];
//         const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
//         enemies.push(
//             new Enemy({
//                 position: {x: (waypoints[0].x - 200) - Math.random() * 100, y: (waypoints[0].y - 96)},
//                 type: randomType,
//                 delay: 500 * i + Math.random() * 3000
//             })
//         );
//     }
// }

const towers = [];
let activeTile = undefined;
let hearts = 15; //player health
let coins = 1000;
let selectedTower = {};

let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;

let frameMultiplier = 1;

const ControlledFPS = true;

var gamePaused = false;

function animate(){
    const animationID = window.requestAnimationFrame(animate);

    const msNow = window.performance.now();
    const msPassed = msNow - msPrev;
    
    if(msPassed > 1000) {
        // pause game
        // console.log("game paused");
        gamePaused = true;
        $("#gamePausedDiv").css("display", "flex");
    }
    
    if(!!ControlledFPS) {
        if(msPassed < msPerFrame) {
            // discard useless frames
            return;
        }
    } else {
        // render all frames
        frameMultiplier = msPassed / msPerFrame;
        frameMultiplier = frameMultiplier > 5 ? 1 : frameMultiplier;
    }
    msPrev = msNow;

    $("#wavesID").text(currentWave + 1 + " / " + levels[currentLevel].waveCount);
    
    for(let i = 0; i < layer1Anim.length; i++) {
        layer1Anim[i].update();
        if(layer1Anim[i].isDone()) {
            layer1Anim.splice(i, 1);
        }
    }

    for(let i = enemies.length - 1; i >= 0; i--){
        const enemy = enemies[i];
        enemy.update();

        //enemies.forEach(enemy => {
            enemy.target = null;

            const validTowers = towers.filter((tower) => {
                const xDiff = tower.center.x - enemy.center.x;
                const yDiff = tower.center.y - enemy.center.y;
                const distance = Math.hypot(xDiff, yDiff);
                return (distance <= tower.radius + enemy.radius) && !enemy.isGonnaBeDead;
            })
    
            //enemy.target = validTowers[0];
            enemy.target = validTowers[Math.floor(Math.random() * validTowers.length)]; // randomize target

            for(let i = enemy.projectiles.length - 1; i >= 0; i--){
                const projectile = enemy.projectiles[i]
    
                projectile.update();
    
                const xDiff = projectile.enemy.center.x - projectile.position.x;
                const yDiff = projectile.enemy.center.y - projectile.position.y;
                const distance = Math.hypot(xDiff, yDiff);
    
                if(distance <= 50){
                    /* @dev
                     * unique damage from each enemy type
                    **/
                    projectile.enemy.health -= 5;
                    layer3Anim.push(new Effect({
                        x: projectile.enemy.position.x,
                        y: projectile.enemy.position.y
                    }, 0, 0, img.explosions, 160, 160, 128, 128, 6, 200));
                    if (projectile.enemy.health <= 0) {
                        const towerIndex = towers.findIndex((tower) => {
                            return projectile.enemy === tower;
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
                        layer3Anim.push(new Effect({
                            x: projectile.enemy.position.x,
                            y: projectile.enemy.position.y
                        }, 0, 480, img.explosions, 160, 160, 192, 192, 6, 400));
                    }
                    
                    enemy.projectiles.splice(i, 1);
                }
            }
        //})

        if(enemy.position.x > canvas.width - 400){
            hearts -= 1;
            enemies.splice(i, 1);
            $("#hearts").text(hearts);
            shakeCanvas();
        }
    }

    if(hearts === 0){
        cancelAnimationFrame(animationID);
        bgm.bgm1.stop();
        bgm.gameOver.play();
        qUpgradeMenu.fadeOut(150);
        $("#towerSelectionMenu").css("display", "none");
        $("#gameOver").css("display", "flex");  
        $(".upgradeItem").css("display", "none");
        $(".specialClass").css("display", "none");
    }

    if(enemies.length === 0){
        startNextWave();
    }

    placementTiles.forEach(tile => {
        tile.update(mouse);
    });

    towers.forEach(tower => {
        tower.update();
        tower.target = null;
        const validEnemies = enemies.filter((enemy) => {
            const xDiff = enemy.center.x - tower.center.x;
            const yDiff = enemy.center.y - tower.center.y;
            const distance = Math.hypot(xDiff, yDiff);
            return (distance <= enemy.radius + tower.radius) && !enemy.isGonnaBeDead && enemy.spawnDelay <= 0;
        })
        
        //tower.target = validEnemies[0];
        tower.target = validEnemies[Math.floor(Math.random() * validEnemies.length)]; // randomize target
        for(let i = tower.projectiles.length - 1; i >= 0; i--){
            const projectile = tower.projectiles[i]

            projectile.update();

            const xDiff = projectile.enemy.center.x - projectile.position.x + projectile.enemy.constOffset/2;
            const yDiff = projectile.enemy.center.y - projectile.position.y + projectile.enemy.constOffset/2; // include y offset from spawning
            const distance = Math.hypot(xDiff, yDiff);

            if(distance <= projectile.enemy.radius + projectile.radius - 15){ // -15 for nearer impact
                projectile.enemyHit();
                let eX = projectile.enemy.position.x > projectile.position.x ? 32 : -32;
                let eY = projectile.enemy.position.y > projectile.position.y ? 32 : -32;
                switch(tower.towerClass){
                    case "Ice":
                        if(projectile.enemy.health > 0){
                            sfx.towerSlow.play();
                        }
                        if(projectile.enemy.state === "iced"){
                            projectile.enemy.changeState("iced", 200);
                        } else{
                            projectile.enemy.changeState("slowed", tower.slowedMS);
                        }
                        layer3Anim.push(new Effect({
                            x: (projectile.position.x + eX),
                            y: (projectile.position.y + eY)
                        }, 0, 320, img.explosions, 160, 160, 64, 64, 6, 200));
                        projectile.enemy.health -= tower.towerDamage;
                        break;
                    case "Lightning":
                        sfx.towerStrike.play();
                        projectile.enemy.changeState("striked", 200);
                        const otherEnemies = enemies.filter(e => e !== projectile.enemy);
                        otherEnemies.sort((a, b) => {
                            const distA = Math.hypot(projectile.enemy.center.x - a.center.x, projectile.enemy.center.y - a.center.y);
                            const distB = Math.hypot(projectile.enemy.center.x - b.center.x, projectile.enemy.center.y - b.center.y);
                            return distA - distB;
                        });

                        otherEnemies.slice(0, tower.strikedEnemies).forEach(enemy => {
                            enemy.health -= (tower.towerDamage / 2); 
                            enemy.changeState("striked", 200);
                        });
                        layer3Anim.push(new Effect({
                            x: (projectile.position.x + eX),
                            y: (projectile.position.y + eY)
                        }, 0, 0, img.explosions, 160, 160, 64, 64, 6, 200));
                        projectile.enemy.health -= tower.towerDamage;
                        break;
                    default:
                        layer3Anim.push(new Effect({
                            x: (projectile.position.x + eX),
                            y: (projectile.position.y + eY)
                        }, 0, 160, img.explosions, 160, 160, 64, 64, 6, 200));
                        projectile.enemy.health -= tower.towerDamage;
                }
                if(projectile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    });

                    if(enemyIndex > -1){
                        enemies.splice(enemyIndex, 1);
                        sfx.enemyDeath.play();
                        coins += projectile.enemy.coinDrop;
                        qCoins.text(coins);
                    }
                    layer3Anim.push(new Effect({
                        x: projectile.enemy.position.x + projectile.enemy.constOffset + 43,
                        y: projectile.enemy.position.y + projectile.enemy.constOffset - 5
                    }, 0, 480, img.explosions, 160, 160, 130, 130, 6, 400));
                }

                tower.projectiles.splice(i, 1);
            }
        }
    });
    
    for(let i = 0; i < layer3Anim.length; i++) {
        layer3Anim[i].update();
        if(layer3Anim[i].isDone()) {
            layer3Anim.splice(i, 1);
        }
    }
}

$(() => {

    /**
     * MAIN LOOP
    **/

    spawnEnemies();
    
    layer1Anim.push(new Effect({
        x: 0,
        y: 0,
    }, 0, 0, img.level1, 1920, 960, 1920, 960, 1, 0, 1));
    
    layer1Anim.push(new Effect({
        x: 192 * 8,
        y: 192 * 1,
    }, 0, 0, img.base, 192, 192, 192, 192, 1, 0, 1));
    
    layer1Anim.push(new Effect({
        x: -35,
        y: 130,
    }, 0, 0, img.portal, 192, 192, 250, 270, 3, 0, 5)); // 3 frames, 5 frames per second
    
    let fl = [
        [0, 0, 0, 192],
        [192 * 3, 192 * 4, 0, 192],
        [192 * 4, 192 * 0, 0, 0],
        [192 * 9, 192 * 1, 0, 192],
    ];
    fl.forEach(d => {
        layer1Anim.push(new Effect({
            x: d[0],
            y: d[1],
        }, d[2], d[3], img.flowers, 192, 192, 192, 192, 4, 0, 3)); // 4 frames, 3 frames per second
    });
    
    layer3Anim.push(new Effect({
        x: 192 * 8 + 20,
        y: 192 * 1 + 20,
    }, 0, 0, img.alien1, 34, 50, 34, 50, 8, 0, 8));
    
    let loaderId = setInterval(() => {
        let total = Object.keys(files.images).length;
        if(loaded >= total) {
            console.log("All assets loaded");
            clearInterval(loaderId);
            animate();
        } else {
            console.log("Loaded " + loaded + " of " + total + " assets");
        }
    }, 400);

});

let mouse = {
    x: undefined,
    y: undefined
}

//canvas.addEventListener('click', (event) => {
$(canvas).on('click', (event) => {
    if(activeTile && !activeTile.isOccupied && coins - 5 >= 0 && !gamePaused){
        showTowerSelection();
    }
    else if(activeTile && activeTile.isOccupied && !gamePaused){
        showTowerMenu();   
    }
    else if(!isClickOnTowerTile(event) && !isClickOnUpgradeMenu(event) && !gamePaused){
        qUpgradeMenu.fadeOut(150);
        $(".upgradeItem, #towerSelectionMenu, .upgradeBox, .shopMenu").css("display", "none");
    }
});

function showTowerSelection(){
    selectedTower = placementTiles.find(tile =>
    tile.position.x === activeTile.position.x &&
    tile.position.y === activeTile.position.y);
    qUpgradeMenu.fadeOut(150);
    $(".upgradeBox, .upgradeItem, .shopMenu").css("display", "none");
    $("#towerSelectionMenu").css("display", "block");
    $("#towerSelectionMenu").css("top", activeTile.position.y + "px");
    $("#towerSelectionMenu").css("left", activeTile.position.x + "px");
}

function showTowerMenu(){
    const tower = towers.find(tower => tower.position.x === activeTile.position.x 
        && tower.position.y === activeTile.position.y);
    if(tower){
        qUpgradeMenu.fadeIn(150);
        $(".normalTowerClass").css("display", "flex");
        $(".upgradeBox").css({
            "display": "block",
            "top": activeTile.position.y + 137,
            "left": activeTile.position.x
        });
        $("#upgradeStatsText").css("display", "block");
        $(".shopMenu").css("display", "none");
        $(".upgradeItem, #specialUpgrade, #healthUpDiv").css("display", "inline-block");
        $("#towerMaxHealth").text(tower.health + " / " + tower.maxHealth);
        $("#towerAttackSpeed").text(tower.attackSpeed / 100);
        $("#towerProjectileSpeed").text(Math.ceil(tower.projectileSpeed * 100) / 100);
        $("#towerClass").text(tower.towerClass);
        $("#towerDamage").text(tower.towerDamage);
        $("#towerLevel").text(tower.towerLevel);
        $("#healthIncrease").text(tower.healthIncrease);
        $("#attackSpeedIncrease").text("-" + tower.attackSpeedIncrease / 100);
        $("#projectileSpeedIncrease").text(tower.projectileSpeedIncrease);
        $("#upgradeButton").text("Upgrade [" + tower.upgradeCost + "]");
        $("#sellButton").text("Sell [" + tower.towerPrice + "]");
        $("#specialUpgradeDiv").css("display", "flex");

        if(tower.towerLevel == 5){
            $("#upgradeButton").css("display", "none");
            $("#towerLevel").text(tower.towerLevel + " (MAX)");
        }

        if(tower.towerClass === "Common" && tower.towerLevel === 1){
            $("#shopButton").css("display", "flex");
        } else{
            $("#shopButton").css("display", "none");
        }

        switch(tower.towerClass){
            case "Common":
                $("#special").text("Increase fire rate for " + (tower.fireRateTime / 1000) + "s");
                $("#abilityDiv, #ability, #abilityUpDiv, #abilityUp").css("display", "none");
                $("#specialUpgrade").text("Increase fire rate duration to 1s");
            break;
            case "Ice":
                $("#special").text("Freeze all enemies for " + (tower.icedMS / 1000) + "s");
                $("#ability").text(tower.slowedMS / 1000 + "s");
                $("#abilityDiv").text("Slow Time: ");
                $("#abilityUpDiv").text("Slow Time Increase: ");
                $("#abilityUp").text(tower.slowedMSIncrease / 1000 + "s");
                $("#specialUpgrade").text("Increase freeze duration to 0.5s");
                break;
            case "Lightning":
                $("#special").text("Deals " + (Math.ceil((tower.towerDamage * tower.strikeDamage) * 100) / 100) + " damage to all enemies");
                $("#ability").text(tower.strikedEnemies + 1);
                $("#abilityDiv").text("Enemies Striked: ");
                $("#abilityUpDiv").text("Enemies Striked Increase: ");
                $("#abilityUp").text("1");
                $("#specialUpgrade").text("Increases damage dealt");
                break;
            case "Sniper":
                $("#special").text("Destroys all enemies in the area");
                $("#specialUpgrade").text("Decreases cooldown time");
                $("#ability").text("2x more than common towers");
                $("#abilityDiv").text("Tower Range: ");
                $("#abilityUpDiv, #abilityUp").css("display", "none");
                break;
            case "Heal":
                $(".normalTowerClass").css("display", "none");
                $("#special").text("Heals all towers every " + (tower.specialTimer / 1000) + "s");
                $("#specialUpgrade").text("Decreases cooldown time");
                $("#towerClass").text("Heal Tower");
                break;
            case "AttackBoost":
                $(".normalTowerClass").css("display", "none");
                $("#special").text("Boosts attacks for all towers every " + (tower.specialTimer / 1000) + "s for " + (tower.boostAttackAmount / 1000) + "s");
                $("#specialUpgrade").text("Increases boost time by 0.5s");
                $("#towerClass").text("Attack Boost Tower");
                break;
            case "SpeedProjectile":
                $(".normalTowerClass, #upgradeButton, #upgradeStatsText, #specialUpgrade, #specialUpgradeDiv, #healthUpDiv").css("display", "none");
                $("#towerClass").text("Speed Projectile Tower");
                $("#special").text("Increases projectile speed for all towers");
                $("#towerLevel").text(tower.towerLevel + " [NOT UPGRADEABLE]");
                break;
        }

        selectedTower = tower;
    }
}

$("#commonTowerButton").click(() => placeTower("Common"));
$("#iceTowerButton").click(() => placeTower("Ice"));
$("#lightningTowerButton").click(() => placeTower("Lightning"));
$("#sniperTowerButton").click(() => placeTower("Sniper"));

function placeTower(towerClass){
    sfx.towerPlace.play();
    if (activeTile && !activeTile.isOccupied && coins - 5 >= 0 && !gamePaused) {
        coins -= 5;
        $("#coins").text(coins);
        let newTower = createTower({position: selectedTower.position, towerType: towerClass});
        towers.push(newTower);
        activeTile.isOccupied = true;   
    }
    $("#towerSelectionMenu").css("display", "none");
}

$("#shopButton").click(() => {
    qUpgradeMenu.fadeOut(150);
    $(".shopMenu").css("display", "flex");
})

$("#upgradeButton").click(() => {
    let tower = selectedTower;
    if(coins >= tower.upgradeCost){
        sfx.towerUpgrade.play();
        tower.upgrade();
        qCoins.text(coins);
        qUpgradeMenu.fadeOut(150);
        $(".upgradeBox, .upgradeItem").css("display", "none");
    }
})

$("#sellButton").click(() => {
    sfx.towerDestroyed.play();
    if (selectedTower) {
        const index = towers.indexOf(selectedTower);
        if (index !== -1) {
            towers.splice(index, 1);
            if(selectedTower.towerClass !== "SpeedProjectile"){
                selectedTower.specialButton.style.display = "none";
            }

            const tile = placementTiles.find(tile =>
                tile.position.x === selectedTower.position.x &&
                tile.position.y === selectedTower.position.y
            );

            if (tile) {
                tile.isOccupied = false;
            }

            coins += selectedTower.towerPrice;
            qCoins.text(coins);

            selectedTower = null;
            qUpgradeMenu.fadeOut(150);
            $(".upgradeBox, .upgradeItem").css("display", "none");
        }
    }
});

$("#specialHealButton").click(() =>{
    let tower = selectedTower;
    tower.health = 0;
    let newTower = createTower({position: tower.position, towerType: "Heal"});
    towers.push(newTower);
    $(".shopMenu").css("display", "none");
})

$("#attackBoostButton").click(() => {
    let tower = selectedTower;
    tower.health = 0;
    let newTower = createTower({position: tower.position, towerType: "AttackBoost"});
    towers.push(newTower);
    $(".shopMenu").css("display", "none");
})

$("#speedProjectileButton").click(() => {
    let tower = selectedTower;
    tower.health = 0;
    let newTower = createTower({position: tower.position, towerType: "SpeedProjectile"});
    towers.push(newTower);
    $(".shopMenu").css("display", "none");
})

$("#musicButton").click(() => {if(!bgm.bgm1.playing()){bgm.bgm1.play()}});
$("#musicPause").click(() => bgm.bgm1.pause());


$("#resumeButton").click((e) => {
    gamePaused = false;
    $("#gamePausedDiv").css("display", "none");
});


function isClickOnTowerTile(event){
    const towerTiles = placementTiles.filter(tile => tile.isOccupied);
    return towerTiles.some(tile => {
        const rect = canvas.getBoundingClientRect();
        const tileX = tile.position.x + rect.left;
        const tileY = tile.position.y + rect.top;
        return event.clientX >= tileX && event.clientX <= tileX + tile.size &&
               event.clientY >= tileY && event.clientY <= tileY + tile.size;
    });
}

function isClickOnUpgradeMenu(event){
    const upgradeMenu = document.querySelector('.upgradeMenu');
    return event.target === upgradeMenu || upgradeMenu.contains(event.target);
}

//window.addEventListener('mousemove', (event) => {
$(window).on('mousemove', (event) => {
    mouse.x = event.clientX / screenZoom;
    mouse.y = event.clientY / screenZoom;
    activeTile = null;

    for(let i = 0; i <= placementTiles.length; i++){
        const tile = placementTiles[i];
        try {
            if(mouse.x >= tile.position.x && mouse.x <= tile.position.x + tile.size &&
                mouse.y >= tile.position.y && mouse.y <= tile.position.y + tile.size){
                    activeTile = tile;
                    break;
            }
        } catch(e) { };
    }
});

//window.addEventListener('keypress', (e) => {
$(window).on('keypress', (e) => {
    if(e.key === 'p' || e.key === 'P'){
        gamePaused = !gamePaused;
        gamePaused ? $("#gamePausedDiv").css("display", "flex") : $("#gamePausedDiv").css("display", "none");
    }
});

function shakeCanvas(){
    sfx.baseHit.play();
    let intensity = 10;
    let duration = 100;

    let startTime = window.performance.now();

    function shake(){
        let currentTime = window.performance.now();
        let elapsedTime = currentTime - startTime;

        if(elapsedTime < duration){
            $("#redVignette").css("display", "block");
            let dx = Math.sin(elapsedTime / duration * Math.PI * 2) * intensity;
            let dy = Math.cos(elapsedTime / duration * Math.PI * 2) * intensity;

            canvas.style.transform = "translate(" + dx + "px, " + dy + "px)";

            requestAnimationFrame(shake);
        }else{
            $("#redVignette").css("display", "none");
            canvas.style.transform = "translate(0, 0)";
        }
    }

    shake();
}