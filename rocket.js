class Rocket {
    constructor(game, startX, startY) {
        this.game = game;
        this.x = this.game.width - 50; // Fixed position at the middle right of the screen
        this.y = this.game.height / 2;
        this.width = 50;
        this.height = 50;
        this.speed = 3;
        this.isCloseToPlayer = false;
        this.path = [];
        this.gridSize = this.game.gridSize;
        this.updatePath(); // Update the initial path to the player
    }

    draw() {
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.updatePath(); 

        if (this.path.length > 0) {
            const nextPosition = this.path.shift();
            this.x = nextPosition.x;
            this.y = nextPosition.y;
        } else {
            this.isCloseToPlayer = true;
        }

        if (this.isCloseToPlayer) {
            this.x -= this.speed * 2;
        }
        if (this.x > this.game.width || this.x < -this.width) {
            this.markedForDeletion = true;
        }
    }

    updatePath() {
        const start = { x: Math.floor(this.x / this.gridSize), y: Math.floor(this.y / this.gridSize) };
        const end = { x: Math.floor(this.game.player.x / this.gridSize), y: Math.floor(this.game.player.y / this.gridSize) };
        this.path = this.game.findPath(start, end); // Use game's pathfinding method
    }
}