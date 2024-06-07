class Rocket {
    constructor(game) {
        this.game = game;
        this.x = this.game.width - 50; // Fixed position at the middle right of the screen
        this.y = this.game.height / 2;
        this.width = 50;
        this.height = 50;
        this.speed = 3;
        this.path = [];
        this.gridSize = this.game.gridSize;
    }

    draw() {
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.updatePath(); 

        if (this.path.length > 0) {
            const nextPosition = this.path[0];
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