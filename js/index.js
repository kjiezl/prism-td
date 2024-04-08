"use strict";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

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

const placementTilesData2D = [];

for(let i = 0; i < placementTilesData.length; i += 10){
    placementTilesData2D.push(placementTilesData.slice(i, i + 20))
}

const placementTiles = [];

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
})

const image = new Image();
image.src = 'sprites/map/level1.png';
image.onload = () =>{
    animate();
}

const enemies = [];

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
let hearts = 5; //player health
let coins = 205;
let selectedTower = {};

let portal = new Image();
portal.src = 'sprites/gameobj/portal1.png';
let portalCount = 0;
let portalFrameX = 0;

let flowers = new Image();
flowers.src = 'sprites/gameobj/flowers.png';
let flowersCount = 0;
let flowersFrameX = 0;

spawnEnemies();

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

    ctx.drawImage(image, 0, 0);
    ctx.drawImage(portal, 192 * portalFrameX, 0, 192, 192, -35, 130, 250, 270);
    ctx.drawImage(flowers, 192 * flowersFrameX, 0, 192, 192, 768, 0, 192, 192);
    ctx.drawImage(flowers, 192 * flowersFrameX, 192, 192, 192, 576, 768, 192, 192);
    ctx.drawImage(flowers, 192 * flowersFrameX, 192, 192, 192, 1728, 192, 192, 192);
    ctx.drawImage(flowers, 192 * flowersFrameX, 192, 192, 192, 0, 0, 192, 192);

    for(let i = enemies.length - 1; i >= 0; i--){
        const enemy = enemies[i];
        enemy.update();

        enemies.forEach(enemy => {
            enemy.target = null;

            const validTowers = towers.filter((tower) => {
                const xDiff = tower.center.x - enemy.center.x;
                const yDiff = tower.center.y - enemy.center.y;
                const distance = Math.hypot(xDiff, yDiff);
                return distance <= tower.radius + enemy.radius;
            })
    
            enemy.target = validTowers[0];

            for(let i = enemy.projectiles.length - 1; i >= 0; i--){
                const projectile = enemy.projectiles[i]
    
                projectile.update();
    
                const xDiff = projectile.enemy.center.x - projectile.position.x;
                const yDiff = projectile.enemy.center.y - projectile.position.y;
                const distance = Math.hypot(xDiff, yDiff);
    
                if(distance <= 45){
                    projectile.enemy.health -= 5;
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
                            
                            sfx.towerDestroyed.play();
                            tower.specialButton.style.display = "none";
                            towers.splice(towerIndex, 1);
                        }
                    }                    
                    enemy.projectiles.splice(i, 1);
                }
            }
        })

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
        qUpgradeMenu.css("display", "none");
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
    })

    towers.forEach(tower => {
        tower.update();
        tower.target = null;
        const validEnemies = enemies.filter((enemy) => {
            const xDiff = enemy.center.x - tower.center.x;
            const yDiff = enemy.center.y - tower.center.y;
            const distance = Math.hypot(xDiff, yDiff);
            return (distance <= enemy.radius + tower.radius) && !enemy.isGonnaBeDead && enemy.spawnDelay <= 0;
        })
        
        tower.target = validEnemies[0];
        for(let i = tower.projectiles.length - 1; i >= 0; i--){
            const projectile = tower.projectiles[i]

            projectile.update();

            const xDiff = projectile.enemy.center.x - projectile.position.x;
            const yDiff = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDiff, yDiff);

            if(distance <= projectile.enemy.radius + projectile.radius){
                projectile.enemyHit();
                projectile.enemy.health -= tower.towerDamage;
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
                        break;
                }
                if(projectile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    })

                    if(enemyIndex > -1){
                        enemies.splice(enemyIndex, 1);
                        sfx.enemyDeath.play();
                        coins += projectile.enemy.coinDrop;
                        qCoins.text(coins);
                    }
                }

                tower.projectiles.splice(i, 1);
            }
        }
    })
}

// setInterval(() => {
//     console.log(frames)
//   }, 1000)


function anim(){
    portalCount++;
    if(portalCount > 25) portalFrameX++, portalCount = 0;
    if(portalFrameX > 2) portalFrameX = 0;

    flowersCount++;
    if(flowersCount > 50) flowersFrameX++, flowersCount = 0;
    if(flowersFrameX > 3) flowersFrameX = 0;

    requestAnimationFrame(anim);
}

anim();

let mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (event) => {
    if(activeTile && !activeTile.isOccupied && coins - 5 >= 0 && !gamePaused){
        showTowerSelection();
    }
    else if(activeTile && activeTile.isOccupied && !gamePaused){
        const tower = towers.find(tower => tower.position.x === activeTile.position.x 
                                        && tower.position.y === activeTile.position.y);
        if(tower){
            qUpgradeMenu.css("display", "block");
            $(".upgradeBox").css({
                "display": "block",
                "top": activeTile.position.y + 137,
                "left": activeTile.position.x
            });
            $(".upgradeItem").css("display", "inline-block");
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
            }

            selectedTower = tower;
        }
    }

    else if(!isClickOnTowerTile(event) && !isClickOnUpgradeMenu(event) && !gamePaused){
        qUpgradeMenu.css("display", "none");
        $(".upgradeItem, #towerSelectionMenu, .upgradeBox").css("display", "none");
    }
})

function showTowerSelection(){
    selectedTower = placementTiles.find(tile =>
    tile.position.x === activeTile.position.x &&
    tile.position.y === activeTile.position.y);
    qUpgradeMenu.css("display", "none");
    $(".upgradeBox").css("display", "none");
    $(".upgradeItem").css("display", "none");
    $("#towerSelectionMenu").css("display", "block");
    $("#towerSelectionMenu").css("top", activeTile.position.y + "px");
    $("#towerSelectionMenu").css("left", activeTile.position.x + "px");
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

$("#upgradeButton").click(() => {
    let tower = selectedTower;
    if(coins >= tower.upgradeCost){
        sfx.towerUpgrade.play();
        tower.upgrade();
        qCoins.text(coins);
        qUpgradeMenu.css("display", "none");
        $(".upgradeBox").css("display", "none");
        $(".upgradeItem").css("display", "none");
    }
})

$("#sellButton").click(() => {
    sfx.towerDestroyed.play();
    if (selectedTower) {
        const index = towers.indexOf(selectedTower);
        if (index !== -1) {
            towers.splice(index, 1);
            selectedTower.specialButton.style.display = "none";

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
            qUpgradeMenu.css("display", "none");
            $(".upgradeBox").css("display", "none");
            $(".upgradeItem").css("display", "none");
        }
    }
});

$("#musicButton").click(() => {if(!bgm.bgm1.playing()){bgm.bgm1.play()}});
$("#musicPause").click(() => bgm.bgm1.pause());


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

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

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
})

window.addEventListener('keypress', (e) => {
    if(e.key === 'p' || e.key === 'P'){
        gamePaused = !gamePaused;
        gamePaused ? $("#gamePausedDiv").css("display", "flex") : $("#gamePausedDiv").css("display", "none");
    }
})

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