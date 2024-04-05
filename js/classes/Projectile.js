class Projectile{
    constructor({position = {x: 0, y: 0}, enemy, projectileColor, damage, moveSpeed}){
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.enemy = enemy;
        this.radius = 10;
        this.moveSpeed = moveSpeed;
        this.projectileColor = projectileColor;

        this.trailLength = 40;
        this.trailOpacity = 0.5;
        this.trailColor = projectileColor;
        this.maxTrailWidth = 20;
        this.damage = damage;
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

        const angle = Math.atan2(this.enemy.center.y - this.position.y, 
            this.enemy.center.x - this.position.x);

        this.velocity.x = Math.cos(angle) * this.moveSpeed;
        this.velocity.y = Math.sin(angle) * this.moveSpeed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}