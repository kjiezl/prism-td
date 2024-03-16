const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 960;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height)

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
                    x: x * 192,
                    y: y * 192
                }
            }))
        }
    })
})

const image = new Image();
image.onload = () =>{
    animate();
}
image.src = 'sprites/map/level1.png';

const enemies = [];

function spawnEnemies(spawnCount){
    for(let i = 1; i <= spawnCount; i++){
        const enemyTypes = ['common', 'fast', 'range'];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const xOffset = i * Math.floor(Math.random() * 350) + 200;
        enemies.push(
            new Enemy({
                position: {x: (waypoints[0].x + 50) - xOffset, y: waypoints[0].y - 96},
                type: randomType
            })
        )
    }
}

const towers = [];
let activeTile = undefined;
let enemyCount = 1;
let hearts = 5; //player health
let coins = 5;

spawnEnemies(enemyCount);

function animate(){
    const animationID = requestAnimationFrame(animate);

    ctx.drawImage(image, 0, 0);

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
            document.querySelector('#hearts').innerHTML = hearts;
        }
    }

    if(hearts === 0){
        cancelAnimationFrame(animationID);
        document.querySelector('#gameOver').style.display = "flex";
    }

    if(enemies.length === 0){
        enemyCount += 1;
        spawnEnemies(enemyCount);
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
            return distance <= enemy.radius + tower.radius;
        })

        tower.target = validEnemies[0];

        for(let i = tower.projectiles.length - 1; i >= 0; i--){
            const projectile = tower.projectiles[i]

            projectile.update();

            const xDiff = projectile.enemy.center.x - projectile.position.x;
            const yDiff = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDiff, yDiff);

            if(distance <= projectile.enemy.radius + projectile.radius){
                projectile.enemy.health -= 5;
                if(projectile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    })

                    if(enemyIndex > -1){
                        enemies.splice(enemyIndex, 1);
                        coins += 2;
                        document.querySelector('#coins').innerHTML = coins;
                    }
                }

                tower.projectiles.splice(i, 1);
            }
        }
    })
}

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (event) => {
    if(activeTile && !activeTile.isOccupied && coins - 5 >= 0){
        coins -= 5;
        document.querySelector('#coins').innerHTML = coins;
        towers.push(new Tower({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        }))
        activeTile.isOccupied = true;
    }
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    activeTile = null;

    for(let i = 0; i <= placementTiles.length; i++){
        const tile = placementTiles[i];

        if(mouse.x >= tile.position.x && mouse.x <= tile.position.x + tile.size &&
            mouse.y >= tile.position.y && mouse.y <= tile.position.y + tile.size){
                activeTile = tile;
                break;
        }
    }
})