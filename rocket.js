class Rocket {
    constructor(game) {
        this.game = game;
        this.x = this.game.width - 50; // Fixed position at the middle right of the screen
        this.y = this.game.height / 2;
        this.width = 50;
        this.height = 50;
        this.spriteWidth = 180;
        this.spriteHeight = 120;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.collisionX;
        this.collisionY;
        this.collisionRadius = this.scaledWidth*0.2; 
        this.speedY = Math.random() <0.5? -1 * this.game.ratio : 2*this.game.ratio;
        this.image = document.getElementById("rocket");
        this.markedForDeletion = false;
        this.speed = 3;
        this.path = [];
        this.gridSize = this.game.gridSize;
    }

    draw() {
       // this.game.ctx.fillStyle = 'red';
       // this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.game.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.scaledWidth, this.scaledHeight);
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI*2);
        this.game.ctx.stroke();
    }

    resize(){
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
    }

    update() {
        this.updatePath(); 

       this.collisionX = this.x + this.scaledWidth*0.4;
       this.collisionY = this.y + this.scaledHeight * 0.5;

        if (this.path.length > 1) {
            const nextPosition = this.path[1];
            const dx = nextPosition.x - this.x;
            const dy = nextPosition.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance < this.speed) {
                // If close enough to the next point in the path, move to it and remove it from the path
                this.x = nextPosition.x;
                this.y = nextPosition.y;
                this.path.shift();
            } else {
                // Move towards the next point in the path
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        }

        if (this.x > this.game.width || this.x < -this.width || this.y > this.game.height || this.y < -this.height) {
            this.markedForDeletion = true;
        }
    }

    updatePath() {
        const start = { x: Math.floor(this.x / this.gridSize), y: Math.floor(this.y / this.gridSize) };
        const end = { x: Math.floor(this.game.player.x / this.gridSize), y: Math.floor(this.game.player.y / this.gridSize) };
        this.path = this.game.findPath(start, end); // Use game's pathfinding method
    }
}