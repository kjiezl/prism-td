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
        lightningStrike: "sprites/effects/lightning-strike2.png",
        iced: "sprites/effects/iced.png",
    }
};

var img = {};
var loaded = 0;
Object.keys(files.images).forEach(key => {
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
var layer2Anim = [];
var layer3Anim = [];
var projectiles = [];

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

    enemies.forEach(enemy => {
        enemy.health += 5 * currentWave;
        enemy.maxHealth += 5 * currentWave;
    })
}

function startNextWave(){
    currentWave++;
    if(currentWave < levels[currentLevel].waveCount){
        spawnEnemies();
    } else{
        currentLevel++;
    }
}

const towers = [];
let activeTile = undefined;
let hearts = 15;
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

    placementTiles.forEach(tile => {
        tile.update(mouse);
    });

    towers.forEach(tower => {
        tower.update();
    });

    for(let i = enemies.length - 1; i >= 0; i--){
        let enemy = enemies[i];
        enemy.update();

        if(enemy.position.x > canvas.width - 400){
            hearts -= 1;
            enemies.splice(i, 1);
            $("#hearts").text(hearts);
            shakeCanvas();
        }
    }
    
    projectiles.forEach(projectile => {
        projectile.update();
    });

    if(enemies.length === 0){
        startNextWave();
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
    
    for(let i = 0; i < layer3Anim.length; i++) {
        layer3Anim[i].update();
        if(layer3Anim[i].isDone()) {
            layer3Anim.splice(i, 1);
        }
    }
}

$(() => {

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

$(canvas).on('click', (event) => {
    if(activeTile && !activeTile.isOccupied && coins - 5 >= 0 && !gamePaused){
        towers.forEach(tower => {tower.showTowerRange = false});
        showTowerSelection();
    }
    else if(activeTile && activeTile.isOccupied && !gamePaused){
        towers.forEach(tower => {tower.showTowerRange = false});
        showTowerMenu();
    }
    else if(!isClickOnTowerTile(event) && !isClickOnUpgradeMenu(event) && !gamePaused){
        qUpgradeMenu.fadeOut(150);
        towers.forEach(tower => {tower.showTowerRange = false});
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
        tower.showTowerRange = true;
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
    towers.forEach(tower => {tower.showTowerRange = false});
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
    $(".shopMenu").css("display", "block");
})

$("#upgradeButton").click(() => {
    towers.forEach(tower => {tower.showTowerRange = false});
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
    towers.forEach(tower => {tower.showTowerRange = false});
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

$("#specialHealButton").click(() => {upgradeSpecial("Heal")});
$("#attackBoostButton").click(() => {upgradeSpecial("AttackBoost")});
$("#speedProjectileButton").click(() => {upgradeSpecial("SpeedProjectile")});

function upgradeSpecial(specialClass){
    let tower = selectedTower;
    tower.health = 0;
    coins -= tower.specialCost;
    qCoins.text(coins);
    let newTower = createTower({position: tower.position, towerType: specialClass});
    towers.push(newTower);
    $(".shopMenu").css("display", "none");
}

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