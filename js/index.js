"use strict";

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

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
    }),
    countdown: new Howl({
        src: ['sfx/countdown.mp3'],
        volume: 0.5
    }),
    nextWave: new Howl({
        src: ['sfx/nextwave.mp3'],
        volume: 0.2
    }),
    levelCompleteSound: new Howl({
        src: ['sfx/level-complete.mp3'],
        volume: 0.6
    }),
    buttonClick: new Howl({
        src: ['sfx/button-click.mp3']
    }),
    towerDisable: new Howl({
        src: ['sfx/tower-disable.mp3']
    })
}

let bgm = {
    level1bgm: new Howl({
        src: ['bgm/level1-bgm1.mp3'],
        loop: true,
        volume: 0.5
    }),
    level2bgm: new Howl({
        src: ['bgm/level2-bgm1.mp3'],
        loop: true,
        volume: 0.5
    }),
    level3bgm: new Howl({
        src: ['bgm/level3-bgm1.mp3'],
        loop: true,
        volume: 0.5
    }),
    level4bgm: new Howl({
        src: ['bgm/endless-level.mp3'],
        loop: true,
        volume: 0.5
    }),
    gameOver: new Howl({
        src: ['bgm/gameover.mp3'],
        volume: 0.2,
        loop: false
    }),
    boss1: new Howl({
        src: ['bgm/boss1.mp3'],
        volume: 0.5,
        loop: true
    }),
    boss2: new Howl({
        src: ['bgm/boss2.mp3'],
        volume: 0.4,
        loop: true
    }),
    boss3: new Howl({
        src: ['bgm/boss3.mp3'],
        volume: 0.4,
        loop: true
    })
}

var files = {
    images: {
        level1: "sprites/map/level1.png",
        level2: "sprites/map/level2.png",
        level3: "sprites/map/level3.png",
        endless: "sprites/map/level4.png",
        portal: "sprites/gameobj/portal1.png",
        portal1: "sprites/gameobj/portal.png",
        flowers: "sprites/gameobj/flowers.png",
        base: "sprites/gameobj/base.png",
        explosions: "sprites/effects/explosions.png",
        commonEnemy: "sprites/enemies/common-enemy.png",
        fastEnemy: "sprites/enemies/fast-enemy.png",
        rangeEnemy: "sprites/enemies/range-enemy.png",
        defEnemy: "sprites/enemies/def-enemy.png",
        flyingEnemy: "sprites/enemies/flying-enemy.png",
        starEnemy: "sprites/enemies/star-enemy.png",
        lightningEnemy: "sprites/enemies/lightning-enemy.png",
        scribblesEnemy: "sprites/enemies/scribbles-enemy.png",
        scribblesEnemy2: "sprites/enemies/scribbles-enemy-2.png",
        scribblesEnemy3: "sprites/enemies/scribbles-enemy-3.png",
        commonEnemyStriked: "sprites/enemies/common-enemy-striked1.png",
        fastEnemyStriked: "sprites/enemies/fast-enemy-striked1.png",
        rangeEnemyStriked: "sprites/enemies/range-enemy-striked1.png",
        defEnemyStriked: "sprites/enemies/def-enemy-striked1.png",
        flyingEnemyStriked: "sprites/enemies/flying-enemy-striked1.png",
        starEnemyStriked: "sprites/enemies/star-enemy-striked1.png",
        lightningEnemyStriked: "sprites/enemies/lightning-enemy-striked1.png",
        scribblesEnemyStriked: "sprites/enemies/scribbles-enemy-striked1.png",
        commonEnemySlowed: "sprites/enemies/common-enemy-slowed.png",
        fastEnemySlowed: "sprites/enemies/fast-enemy-slowed.png",
        rangeEnemySlowed: "sprites/enemies/range-enemy-slowed.png",
        defEnemySlowed: "sprites/enemies/def-enemy-slowed.png",
        flyingEnemySlowed: "sprites/enemies/flying-enemy-slowed.png",
        starEnemySlowed: "sprites/enemies/star-enemy-slowed.png",
        lightningEnemySlowed: "sprites/enemies/lightning-enemy-slowed.png",
        scribblesEnemySlowed: "sprites/enemies/scribbles-enemy-slowed.png",
        alien1: "sprites/gameobj/alien-1-34x50.png",
        lightningStrike: "sprites/effects/lightning-strike2.png",
        iced: "sprites/effects/iced.png",
        coins: "sprites/gameobj/coins.png",
        crystal: "sprites/gameobj/crystal.png",
        towerDisabled: "sprites/towers/tower-disabled.png",
        specialEffects: "sprites/effects/special-effects.png",
        teleportPortal: "sprites/effects/teleport-portal.png",
        teleportPortalSide: "sprites/effects/teleport-portal-side.png",
        teleportPortal2Side: "sprites/effects/teleport-portal2-side.png",
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

function getParam(param){
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

var levelParam = getParam("level");
// console.log("level: " + parseInt(levelParam));

levelParam = levelParam == null ? 1 : parseInt(levelParam);

var enemies = [];
var layer1Anim = [];
var layer2Anim = [];
var layer3Anim = [];
var projectiles = [];
var pausedTime = 0;

let currentWave = -1;
let currentLevel = levelParam - 1;
let currentBGM = null;

let wavesDone = false;

var placementTiles = [];
var waypoints = [];
var waypoints1 = [];
var waypoints2 = [];

require("levelLoaded", () => {
    canvas.width = levels[currentLevel].mapSize[0];
    canvas.height = levels[currentLevel].mapSize[1];
    $("#nightTint").css("width", levels[currentLevel].mapSize[0]);
    $("#nightTint").css("height", levels[currentLevel].mapSize[1]);
    
    if(levelParam === 4){
        waypoints1 = levels[currentLevel].waypoints1;
        waypoints2 = levels[currentLevel].waypoints2;
    } else{
        waypoints = levels[currentLevel].waypoints;
    }
    for(let y = 0; y < levels[currentLevel].tileSize[1]; y++) {
        for(let x = 0; x < levels[currentLevel].tileSize[0]; x++) {
            let currentIndex = (y * levels[currentLevel].tileSize[0]) + x;
            if(levels[currentLevel].placementTilesData[currentIndex] == 9) {
                placementTiles.push(new placementTile({
                    position: {
                        x: x * canvas.width / levels[currentLevel].tileSize[0],
                        y: y * canvas.height / levels[currentLevel].tileSize[1],
                    }
                }));
            }
        }
    }
});

function spawnEnemies(){
    let wave = levels[currentLevel].waves[currentWave];

    let spawnCount = 0;
    for(let enemyType in wave){
        spawnCount += wave[enemyType];
    }
    
    for(let i = 1; i <= spawnCount; i++){
        const enemyTypes = Object.keys(wave);
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        switch(levelParam){
            case 1:
                enemies.push(
                    new Enemy({
                        position: {x: (waypoints[0].x - 200) - Math.random() * 100, y: (waypoints[0].y - 96)},
                        type: randomType,
                        delay: 500 * i + Math.random() * 3000,
                        healthMultiplier: 5 * currentWave
                    })
                );
                break;
            case 2:
                enemies.push(
                    new Enemy({
                        position: {x: (waypoints[0].x) - Math.random() * 100, y: (waypoints[0].y - 96)},
                        type: randomType,
                        delay: 500 * i + Math.random() * 3000,
                        healthMultiplier: 5 * currentWave
                    })
                );
                break;
            case 3:
                enemies.push(
                    new Enemy({
                        position: {x: (waypoints[0].x - 90), y: (waypoints[0].y - 96)},
                        type: randomType,
                        delay: 500 * i + Math.random() * 3000,
                        healthMultiplier: 5 * currentWave
                    })
                );
                break;
        }
    }
}

let waveStartTime = 0;
let waveCountdown = 0;
let levelComplete = false;
let isGameOver = false;
let spawnCount = 3;
let spawnCountInc = 0.35;
let spawnPoint = 1;

function startCountdown(){
    if(waveStartTime === 0){
        waveStartTime = window.performance.now();
        return;
    }

    let elapsedTime = gamePaused ? pausedTime : window.performance.now() - waveStartTime;
    // let elapsedTime = window.performance.now() - waveStartTime;
    let countdown = Math.ceil((waveCountdown - elapsedTime) / 1000);

    if(countdown >= 0){
        // console.log(countdown);
        $("#countdown").text(countdown);
        return;
    }
    
    startNextWave();
}

function restartCountdown() {
    waveStartTime = 0;
    startCountdown();
}

$("#countdownSVG").click(() => {
    startNextWave();
});

function endlessSpawn(spawnCount){
    if((currentWave + 1) % 10 === 0){
        let bossType;
        if ((currentWave + 1) % 20 === 0) {
            bossType = "lightning";
        } else if ((currentWave + 1) % 30 === 0) {
            bossType = "scribbles";
        } else {
            bossType = "star";
        }

        let i;
        spawnPoint === 1 ? i = waypoints1 : i = waypoints2;

        enemies.push(
            new Enemy({
                position: {x: (i[0].x - 90), y: (i[0].y - 96)},
                type: bossType,
                delay: 500 + Math.random() * 3000,
                healthMultiplier: 5 * currentWave,
                spawnPoint: spawnPoint
            })
        );
    }
    for(let i = 0; i < spawnCount; i++){
        let enemyTypes = ["common"];
        if(currentWave > 2 - 1) enemyTypes.push("fast");
        if(currentWave > 5 - 1) enemyTypes.push("range");
        if(currentWave > 8 - 1) enemyTypes.push("def");
        if(currentWave > 12 - 1) enemyTypes.push("flying");
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        let j;
        spawnPoint === 1 ? j = waypoints1 : j = waypoints2;
        enemies.push(
            new Enemy({
                position: {x: (j[0].x - 90), y: (j[0].y - 96)},
                type: randomType,
                delay: 500 * i + Math.random() * 3000,
                healthMultiplier: 5 * currentWave,
                spawnPoint: spawnPoint
            })
        );
        spawnPoint++;
        if (spawnPoint > 2) {
            spawnPoint = 1;
        }
    }
}

function startNextWave(){
    sfx.nextWave.play();
    $("#countdown").text(Math.ceil((waveCountdown / 1000)));   
    waveStartTime = 0;

    if(levelParam === 4){
        currentWave++;
        if(spawnCountInc < 0.1){
            spawnCountInc += 0.02;
        } else if(spawnCountInc >= 0.35){
            spawnCountInc -= 0.02;
        } else{
            spawnCountInc -= 0.02;
        }
        spawnCount += Math.ceil(spawnCount * spawnCountInc);
        console.log(spawnCountInc + " " + spawnCount);
        endlessSpawn(spawnCount);
    }

    if (currentWave < levels[currentLevel].waveCount - 1 && levelParam !== 4) {
        currentWave++;
        spawnEnemies();
        const validTowers = towers.filter((tower) => {
            return !tower.isGonnaBeDead;
        })
        const random = validTowers.sort(() => Math.random() - 0.5);

        if(currentWave === levels[currentLevel].waveCount - 1 && levelParam === 1){
            wavesDone = true;
            if(currentBGM.playing()){
                currentBGM.stop();
                currentBGM = bgm.boss1;
                currentBGM.play();
            } else{
                currentBGM = bgm.boss1;
            }
            sfx.towerDisable.play();
    
            // const numTargets = Math.ceil(validTowers.length / 2);
            const numTargets = 1;
            for (let i = 0; i < numTargets; i++) {
                if (random[i]) {
                    random[i].disableTower();
                }
            }
        }
        else if(currentWave === levels[currentLevel].waveCount - 1 && levelParam === 2){
            wavesDone = true;
            if(currentBGM.playing()){
                currentBGM.stop();
                currentBGM = bgm.boss2;
                currentBGM.play();
            } else{
                currentBGM = bgm.boss2;
            }
            sfx.towerDisable.play();
            const numTargets = Math.ceil(validTowers.length / 2);
            for (let i = 0; i < numTargets; i++) {
                if (random[i]) {
                    random[i].disableTower();
                }
            }
        }
        else if(currentWave === levels[currentLevel].waveCount - 1 && levelParam === 3){
            wavesDone = true;
            if(currentBGM.playing()){
                currentBGM.stop();
                currentBGM = bgm.boss3;
                currentBGM.play();
            } else{
                currentBGM = bgm.boss3;
            }
        }
    } else {
        if(!gameOver){
            sfx.levelCompleteSound.play();
            showLevelCompleteMenu();
            $(canvas).css({ filter: "invert(0)"});
            $(".specialClass").css({ filter: "invert(0)"});
            levelComplete = true;
            pauseGame();
        }
    }
}

const towers = [];
let activeTile = undefined;
let hearts = null;
let coins = 20;
let score = 0;
let selectedTower = {};

$(".restartButton, #levelCompleteRestart").click(() => restartLevel());
$(".homeButton").click(() => {window.location.href = "main-menu.html"})
$("#levelCompleteNext").click(() => {
    window.location.href="index.html?level=" + (levelParam + 1)
});

function restartLevel(){
    levelComplete = false;
    isGameOver = false;
    $(canvas).css({filter: "invert(0)"});
    $(".specialClass").css({filter: "invert(0)"});
    $("#nightTint").fadeOut(100);
    lastTime = window.performance.now();
    fade = true;
    towers.splice(0, towers.length);
    $(".specialClass").hide();
    enemies.splice(0, enemies.length);
    placementTiles.forEach(tile => {
        tile.isOccupied = false;
    })
    projectiles.splice(0, projectiles.length);
    layer2Anim.splice(0, layer2Anim.length);
    $("#gamePausedDiv, #gameOver, .levelCompleteMenu").css("display", "none");
    score = 0;
    coins = 20;
    // hearts = 15;
    currentWave = -1;
    wavesDone = false;
    switch(levelParam){
        case 1:
            hearts = 10;
            if(currentBGM.playing()){
                currentBGM.stop();
                currentBGM = bgm.level1bgm;
                currentBGM.play();
            } else{
                currentBGM = bgm.level1bgm;
            }
            break;
        case 2:
            hearts = 15;
            if(currentBGM.playing()){
                currentBGM.stop();
                currentBGM = bgm.level2bgm;
                currentBGM.play();
            } else{
                currentBGM = bgm.level2bgm;
            }
            break;
        case 3:
            hearts = 20;
            if(currentBGM.playing()){
                currentBGM.stop();
                currentBGM = bgm.level3bgm;
                currentBGM.play();
            } else{
                currentBGM = bgm.level3bgm;
            }
            break;
        case 4:
            hearts = 20;
            spawnCount = 5;
            if(currentBGM.playing()){
                currentBGM.stop();
                currentBGM = bgm.level4bgm;
                currentBGM.play();
            } else{
                currentBGM = bgm.level4bgm;
            }
            break;
    }
    
    pauseGame();
    restartCountdown();
}

let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;

let frameMultiplier = 1;

const ControlledFPS = true;

var gamePaused = false;

let fade = true;
let lastTime = window.performance.now();

function animate(){
    window.requestAnimationFrame(animate);

    const msNow = window.performance.now();
    const msPassed = msNow - msPrev;
    
    if(msPassed > 1000 && !levelComplete && !isGameOver){
        pauseGame();
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

    if(levelParam !== 4){
        $("#wavesID").text(currentWave + 1 + " / " + levels[currentLevel].waveCount);
    } else{
        $("#wavesID").text(currentWave + 1);
    }
    $(".score").text(score);
    qCoins.text(coins);
    $("#hearts").text(hearts);
    $("#currentLevel").text(levelParam);
    
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

    for(let i = 0; i < layer2Anim.length; i++) {
        layer2Anim[i].update();
        if(layer2Anim[i].isDone()) {
            layer2Anim.splice(i, 1);
        }
    }

    for(let i = enemies.length - 1; i >= 0; i--){
        let enemy = enemies[i];
        enemy.update();

        if(levelParam !== 4){
            if(enemy.waypointIndex == waypoints.length - 1 && levels[currentLevel].enemyCheck(enemy.position)){
                hearts -= 1;
                enemies.splice(i, 1);
                shakeCanvas();
    
                if(enemy.type === "star" || enemy.type === "lightning" || enemy.type === "scribbles"){
                    hearts = 0;
                }
            }
        } else{
            const lastWaypoint1 = waypoints1.length - 1;
            const lastWaypoint2 = waypoints2.length - 1;
        
            if ((enemy.spawnPoint === 1 && enemy.waypointIndex === lastWaypoint1 && levels[currentLevel].enemyCheck(enemy.position)) ||
                (enemy.spawnPoint === 2 && enemy.waypointIndex === lastWaypoint2 && levels[currentLevel].enemyCheck2(enemy.position))) {
                hearts -= 1;
                enemies.splice(i, 1);
                shakeCanvas();
        
                if (["star", "lightning", "scribbles"].includes(enemy.type)) {
                    hearts = 0;
                }
            }
        }
    }
    
    projectiles.forEach(projectile => {
        projectile.update();
    });

    // if(enemies.length === 0 && !levelComplete){
    //     startCountdown();
    // }
    if(!wavesDone && !levelComplete && !gamePaused){
        startCountdown();
    }

    if(hearts === 0){
        pauseGame();
        if(currentBGM.playing()){
            currentBGM.stop();
            $("#musicPause").toggle();
            $("#musicButton").toggle();
        }
        qUpgradeMenu.fadeOut(150);
        $("#towerSelectionMenu, .upgradeItem, .specialClass").css("display", "none");
        $("#gameOver").fadeIn(150).css("display", "flex");  
        isGameOver = true;
    }
    
    for(let i = 0; i < layer3Anim.length; i++) {
        layer3Anim[i].update();
        if(layer3Anim[i].isDone()) {
            layer3Anim.splice(i, 1);
        }
    }

    let currentTime = window.performance.now();
    let deltaTime = gamePaused ? 0 : (currentTime - lastTime);

    if (deltaTime >= 60 * 1000 && !gamePaused) {
        lastTime = currentTime;

        if (fade) {
            $("#nightTint").fadeIn(2000);
            fade = false;
        } else {
            $("#nightTint").fadeOut(2000);
            fade = true;
        }
    }
}

function pauseGame(){
    gamePaused = !gamePaused;
    if(isGameOver || levelComplete){
        $("#gamePausedDiv").css("display", "none");
        gamePaused = true;
    } else{
        gamePaused ? $("#gamePausedDiv").fadeIn(150).css("display", "flex") : $("#gamePausedDiv").fadeOut(150);
    }
    if(gamePaused){
        pausedTime = window.performance.now() - waveStartTime;
        towers.forEach(tower => {
            tower.startTime = window.performance.now();
        })
        enemies.forEach(enemy => {
            enemy.startTime = window.performance.now();
        })
    } else{
        waveStartTime = window.performance.now() - pausedTime;
        towers.forEach(tower => {
            tower.timer += tower.pausedTime;
            if(tower.attackBoost){
                duration += tower.pausedTime;
            }
            if(tower.towerClass === "Common" && tower.commonActive){
                duration2 += tower.pausedTime;
            }
        })
        enemies.forEach(enemy => {
            enemy.stateExpiry += enemy.pausedTime;
        })
    }
}

$(() => {
    levelParam !== 4 ? document.title = "LEVEL " + levelParam : document.title = "ENDLESS MODE";
    require("levelLoaded", () => {
        switch(levelParam){
            case 1:
                layer1Anim.push(new Effect({
                    x: 0,
                    y: 0,
                }, 0, 0, img.level1, 1920, 960, 1920, 960, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: 192 * 8,
                    y: 192 * 1,
                }, 0, 0, img.base, 192, 192, 192, 192, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: -100,
                    y: 130
                }, 0, 0, img.portal1, 192, 192, 350, 270, 6, 0, 12));
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
                layer1Anim.push(new Effect({
                    x: 192 * 8 + 20,
                    y: 192 + 20
                }, 0, 0, img.crystal, 16, 32, 24, 40, 12, 0, 36));
                layer3Anim.push(new Effect({
                    x: 192 * 8 + 150,
                    y: 192 + 130
                }, 0, 0, img.crystal, 16, 32, 20, 36, 12, 0, 36));

                currentBGM = bgm.level1bgm;
                hearts = 10;
                waveCountdown = 20 * 1000;
                $(".selectionLabel").css("color", "rgb(16, 88, 9)");
                break;

            case 2:
                layer1Anim.push(new Effect({
                    x: 0,
                    y: 0,
                }, 0, 0, img.level2, levels[currentLevel].mapSize[0], levels[currentLevel].mapSize[1], canvas.width, canvas.height, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: 192 * 9,
                    y: 192 * 1,
                }, 0, 0, img.base, 192, 192, 192, 192, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: 192 * 3,
                    y: 1260
                }, 0, 0, img.portal1, 192, 192, 350, 270, 6, 0, 12));
                layer1Anim.push(new Effect({
                    x: 192 * 9 + 20,
                    y: 192 + 20
                }, 0, 0, img.crystal, 16, 32, 24, 40, 12, 0, 36));
                layer1Anim.push(new Effect({
                    x: 192 * 9 + 150,
                    y: 192 + 130
                }, 0, 0, img.crystal, 16, 32, 20, 36, 12, 0, 36));

                currentBGM = bgm.level2bgm;
                hearts = 15;
                waveCountdown = 20 * 1000;
                $(".selectionLabel").css("color", "rgb(79, 9, 88)");
                $("#endlessTint").hide();
                break;
            
            case 3:
                layer1Anim.push(new Effect({
                    x: 0,
                    y: 0,
                }, 0, 0, img.level3, levels[currentLevel].mapSize[0], levels[currentLevel].mapSize[1], canvas.width, canvas.height, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: 192 * 11,
                    y: 192 * 4,
                }, 0, 0, img.base, 192, 192, 192, 192, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: 20,
                    y: 192 * 3
                }, 0, 0, img.portal1, 192, 192, 500, 270, 6, 0, 12));
                layer1Anim.push(new Effect({
                    x: 192 * 11 + 20,
                    y: 192 * 4 + 20
                }, 0, 0, img.crystal, 16, 32, 24, 40, 12, 0, 36));
                layer1Anim.push(new Effect({
                    x: 192 * 11 + 150,
                    y: 192 * 4 + 130
                }, 0, 0, img.crystal, 16, 32, 20, 36, 12, 0, 36));
                
                layer1Anim.push(new Effect({
                    x: 3 * 192,
                    y: 5 * 192 + 100
                }, 0, 0, img.teleportPortal, 192, 192, 192, 100, 8, 0, 8));
                layer1Anim.push(new Effect({
                    x: 9 * 192,
                    y: 3 * 192
                }, 0, 192, img.teleportPortal, 192, 192, 192, 100, 8, 0, 8));

                currentBGM = bgm.level3bgm;
                hearts = 20;
                waveCountdown = 25 * 1000;
                $(".selectionLabel").css("color", "white");
                $("#endlessTint").hide();
                break;
            case 4:
                layer1Anim.push(new Effect({
                    x: 0,
                    y: 0,
                }, 0, 0, img.endless, levels[currentLevel].mapSize[0], levels[currentLevel].mapSize[1], canvas.width, canvas.height, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: 192 * 6,
                    y: 192 * 5,
                }, 0, 0, img.base, 192, 192, 192, 192, 1, 0, 1));
                layer1Anim.push(new Effect({
                    x: 192 * 8 + 20,
                    y: 192 * 2
                }, 0, 0, img.portal1, 192, 192, 500, 270, 6, 0, 12));
                layer1Anim.push(new Effect({
                    x: 192 * 2 + 20,
                    y: 192 * 7 + 40
                }, 0, 0, img.portal1, 192, 192, 500, 270, 6, 0, 12));
                layer1Anim.push(new Effect({
                    x: 192 * 6 + 20,
                    y: 192 * 5 + 20
                }, 0, 0, img.crystal, 16, 32, 24, 40, 12, 0, 36));
                layer1Anim.push(new Effect({
                    x: 192 * 6 + 150,
                    y: 192 * 5 + 130
                }, 0, 0, img.crystal, 16, 32, 20, 36, 12, 0, 36));
                
                layer1Anim.push(new Effect({
                    x: 11 * 192,
                    y: 5 * 192
                }, 0, 0, img.teleportPortalSide, 192, 192, 100, 192, 8, 0, 8));
                layer1Anim.push(new Effect({
                    x: 8 * 192 - 100,
                    y: 5 * 192
                }, 0, 192, img.teleportPortalSide, 192, 192, 100, 192, 8, 0, 8));
                layer1Anim.push(new Effect({
                    x: 5 * 192,
                    y: 5 * 192
                }, 0, 0, img.teleportPortal2Side, 192, 192, 100, 192, 8, 0, 8));
                layer1Anim.push(new Effect({
                    x: 2 * 192 - 100,
                    y: 5 * 192
                }, 0, 192, img.teleportPortal2Side, 192, 192, 100, 192, 8, 0, 8));

                currentBGM = bgm.level4bgm;
                hearts = 20;
                waveCountdown = 25 * 1000;
                $(".selectionLabel").css("color", "white");
                $("#endlessTint").show();
                break;
        }
    });

    wavesDone = false;
    // layer1Anim.push(new Effect({
    //     x: -35,
    //     y: 130,
    // }, 0, 0, img.portal, 192, 192, 250, 270, 3, 0, 5)); // 3 frames, 5 frames per second
    
    // layer3Anim.push(new Effect({
    //     x: 192 * 8 + 20,
    //     y: 192 * 1 + 20,
    // }, 0, 0, img.alien1, 34, 50, 34, 50, 8, 0, 8));
    
    let loaderId = setInterval(() => {
        let total = Object.keys(files.images).length;
        if(loaded >= total) {
            console.log("All assets loaded");
            clearInterval(loaderId);
            require(() => {
                return placementTiles.length > 0 ? true : false;
            }, animate);
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
    // if(!currentBGM.playing()){
    //     currentBGM.play();
    //     $("#musicPause").toggle();
    //     $("#musicButton").toggle();
    // }
    if(activeTile && !activeTile.isOccupied && coins - 5 >= 0 && !gamePaused){
        towers.forEach(tower => {tower.showTowerRange = false});
        showTowerSelection();
    }
    else if(activeTile && activeTile.isOccupied && !gamePaused){
        qUpgradeMenu.css("display", "none");
        $(".upgradeBox").css("display", "none");
        towers.forEach(tower => {
            tower.showTowerRange = false;
            // if(!tower.isDisabled) showTowerMenu();
        });
        const tower = towers.find(tower => tower.position.x === activeTile.position.x 
            && tower.position.y === activeTile.position.y);
        if(!tower.isDisabled){
            showTowerMenu();
        } else{
            // console.log("tower disabled");
        }
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
                $("#special").text("Deals great damage to 20% of the enemies in the area");
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
$("#commonTowerButton").hover(() => previewStats("COMMON TOWER"), () =>{$(".previewMenu").fadeOut(10)});
$("#iceTowerButton").click(() => placeTower("Ice"));
$("#iceTowerButton").hover(() => previewStats("ICE TOWER"), () =>{$(".previewMenu").fadeOut(10)});
$("#lightningTowerButton").click(() => placeTower("Lightning"));
$("#lightningTowerButton").hover(() => previewStats("LIGHTNING TOWER"), () =>{$(".previewMenu").fadeOut(10)});
$("#sniperTowerButton").click(() => placeTower("Sniper"));
$("#sniperTowerButton").hover(() => previewStats("SNIPER TOWER"), () =>{$(".previewMenu").fadeOut(10)});

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

function previewStats(towerClass){
    $(".previewMenu").fadeIn(10);
    let description = $("#previewDescription");
    $("#previewTower").text(towerClass);
    switch(towerClass){
        case "COMMON TOWER":
            description.text(
                "Common towers at level 1 can be upgraded into special towers. " +
                "Special attack increases fire rate for a certain time.")
            break;
        case "ICE TOWER":
            description.text(
                "Ice towers slow down enemies once hit. " + 
                "Special attack freezes all enemies in the area for a certain time.")
            break;
        case "LIGHTNING TOWER":
            description.text(
                "Lightning towers can strike multiple enemies at once with a smaller range. " + 
                "Special attack strikes all enemies in the area. " + 
                "Lightning will undo ice tower attacks.")
            break;
        case "SNIPER TOWER":
            description.text(
                "Sniper towers have longer range and damage but less fire rate. " +
                "Special attack deals great damage to 20% of the enemies in the area. " +
                "Can prioritize and target flying enemy types.")
            break;
        case "HEAL TOWER":
            description.text(
                "Heal towers passively heals all towers within a certain time.")
            break;
        case "ATTACK BOOST TOWER":
            description.text(
                "Attack boost towers passively increases attack speed for all towers within a certain time.")
            break;
        case "SPEED PROJECTILE TOWER":
            description.text(
                "Speed projectile towers increases the projectile speed for all towers when it is active.")
            break;
    }
}

function showLevelCompleteMenu(){
    $(".levelCompleteMenu").css("display", "flex");
}

$(".restartButton, #resumeButton, svg").click(() => {sfx.buttonClick.play()});

$("#shopButton").click(() => {
    qUpgradeMenu.fadeOut(150);
    $(".shopMenu").css("display", "flex");
})

$("#upgradeButton").click(() => {
    towers.forEach(tower => {tower.showTowerRange = false});
    let tower = selectedTower;
    if(coins >= tower.upgradeCost){
        sfx.towerUpgrade.play();
        tower.upgrade();
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
                selectedTower.specialButton.hide();
            }

            const tile = placementTiles.find(tile =>
                tile.position.x === selectedTower.position.x &&
                tile.position.y === selectedTower.position.y
            );

            if (tile) {
                tile.isOccupied = false;
            }

            coins += selectedTower.towerPrice;

            selectedTower = null;
            qUpgradeMenu.fadeOut(150);
            $(".upgradeBox, .upgradeItem").css("display", "none");
        }
    }
});

$("#specialHealButton").click(() => {upgradeSpecial("Heal")});
$("#specialHealButton").hover(() => {previewStats("HEAL TOWER")}, () => {$(".previewMenu").fadeOut(10)});
$("#attackBoostButton").click(() => {upgradeSpecial("AttackBoost")});
$("#attackBoostButton").hover(() => {previewStats("ATTACK BOOST TOWER")}, () => {$(".previewMenu").fadeOut(10)});
$("#speedProjectileButton").click(() => {upgradeSpecial("SpeedProjectile")});
$("#speedProjectileButton").hover(() => {previewStats("SPEED PROJECTILE TOWER")}, () => {$(".previewMenu").fadeOut(10)});

function upgradeSpecial(specialClass){
    let tower = selectedTower;
    if(coins - tower.specialCost >= 0){
        tower.health = 0;
        coins -= tower.specialCost;
        let newTower = createTower({position: tower.position, towerType: specialClass});
        towers.push(newTower);
        $(".shopMenu").css("display", "none");
    } else {
        console.log("Need " + (tower.specialCost - coins) + " more coins!");
    }
}

$(".musicToggle").click(() => {
    if(!currentBGM.playing()){
        currentBGM.play();
    } else{
        currentBGM.pause();
    }
    $("#musicPause").toggle();
    $("#musicButton").toggle();
});

$("#pause, #resumeButton").click(() => {pauseGame()});

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

var autoScroll = {
    up: false,
    down: false,
    left: false,
    right: false,
    speed: 8,
};

setInterval(() => {
    if(gamePaused) {
        autoScroll.up = autoScroll.down = autoScroll.left = autoScroll.right = false;
        return;
    }
    if(autoScroll.up) {
        window.scrollBy(0, -autoScroll.speed);
    }
    if(autoScroll.down) {
        window.scrollBy(0, autoScroll.speed);
    }
    if(autoScroll.left) {
        window.scrollBy(-autoScroll.speed, 0);
    }
    if(autoScroll.right) {
        window.scrollBy(autoScroll.speed, 0);
    }
}, 1000/fps);

$(window).on('mousemove', (event) => {
    mouse.x = (event.clientX + window.scrollX) / screenZoom;
    mouse.y = (event.clientY + window.scrollY) / screenZoom;
    activeTile = null;

    for(let i = 0; i <= placementTiles.length; i++){
        const tile = placementTiles[i];
        try {
            if(mouse.x >= tile.position.x && mouse.x <= tile.position.x + tile.sizeX &&
                mouse.y >= tile.position.y && mouse.y <= tile.position.y + tile.sizeY){
                    activeTile = tile;
                    break;
            }
        } catch(e) { };
    }
    
    //console.log(event.clientX + " - " + event.clientY);
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    let mX = event.clientX;
    let mY = event.clientY;
    
        autoScroll.up = autoScroll.down = autoScroll.left = autoScroll.right = false;
    
    if(mX < w * 5 / 100) {
        // in 5% left part of window;
        autoScroll.left = true;
        autoScroll.right = false;
    }
    if(mX > w * 95 / 100) {
        // in 5% right part
        autoScroll.right = true;
        autoScroll.left = false;
    }
    if(mY < h * 5 / 100) {
        // in top part of window
        autoScroll.up = true;
        autoScroll.down = false;
    }
    if(mY > h * 95 / 100) {
        // in bottom part of window
        autoScroll.down = true;
        autoScroll.up = false;
    }
});

$(window).on('keypress', (e) => {
    if(e.key === 'p' || e.key === 'P' && !levelComplete){
        pauseGame();
    }
    if(e.key === 'i'){
        shakeCanvas();
        $(canvas).css({filter:"invert(1)"});
        $(".specialClass").css({filter:"invert(1)"});
    }
    if(e.key === 'o'){
        shakeCanvas();
        $(canvas).css({filter:"invert(0)"});
        $(".specialClass").css({filter:"invert(0)"});
    }
    if(e.key === 'l'){
        const validTowers = towers.filter((tower) => {
            return !tower.isGonnaBeDead;
        })

        // const numTargets = Math.ceil(validTowers.length / 2);
        const numTargets = 1;

        const random = validTowers.sort(() => Math.random() - 0.5);

        for (let i = 0; i < numTargets; i++) {
            if (random[i]) {
                random[i].disableTower();
            }
        }
    }
    if(e.key === 'k'){
        towers.forEach(tower => {
            if(tower.isDisabled){
                tower.enableTower();
            }
        })
    }
    if(e.key === 'h'){
        hearts -= 1;
    }
    if(e.key === 'c'){
        showLevelCompleteMenu();
        // sfx.levelCompleteSound.play();
        levelComplete = true;
        pauseGame();
    }
    if(e.key === '-'){
        enemies.forEach(enemy => {
            if(enemy.type === "scribbles" || enemy.type === "lightning" || enemy.type === "star"){
                enemy.health -= enemy.maxHealth / 3;
            }
        })
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