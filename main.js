class Game {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height / this.baseHeight;
        this.background = new Background(this);
        this.obstacles = [];
        this.numberOfObstacles = 50;
        this.player = new Player(this);
        this.rockets = [];
        this.rocketSpawnTimer = 0;
        this.rocketSpawnInterval = 10000;
        this.audio = new Audio();
        this.gravity;
        this.speed;
        this.minSpeed;
        this.maxSpeed;
        this.gameOver;
        this.timer;
        this.message1;
        this.message2;
        this.message3;
        this.eventUpdate = false;
        this.eventTimer = 0;
        this.eventInterval = 150;
        this.score = 0;
        this.grid = [];
        this.gridSize = 50;
        this.resize(window.innerWidth, window.innerHeight);
        this.createGrid();

        //--------------------------------------------------------------------------------------------------------------------------    
        // resize the canvas as we resize the window
        window.addEventListener("resize", e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        });
        // mouse controls
        this.canvas.addEventListener("mousedown", e => {
            this.player.flap();
        });
        this.canvas.addEventListener("mouseup", e => {
            this.player.wingsUp();
        });
        // keyboard controls
        window.addEventListener("keydown", e => {

            if (e.key === " ") {

                this.player.flap();
            }
            if (e.key === "Shift" || e.key.toLowerCase() === "c") {
                this.player.startCharge();
            }
            if (e.key.toLowerCase() === "r") {
                this.resize(window.innerWidth, window.innerHeight);
            }
        });

        window.addEventListener("keyup", e => {
            if (e.key === " ") {
                this.player.speedY += 1;
                this.player.wingsUp();
            }
            if (e.key === "Shift" || e.key.toLowerCase() === "c") {
                this.player.stopCharge();
            }
        });
    }
    //--------------------------------------------------------------------------------------------------------------------------

    createGrid() {
        const rows = Math.ceil(this.height / this.gridSize);
        const cols = Math.ceil(this.width / this.gridSize);
        this.grid = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
    }
    //--------------------------------------------------------------------------------------------------------------------------    

    findPath(start, end) {
        const queue = [start];
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);
        const direction = [
            { x: 0, y: -1 }, // UP
            { x: 1, y: 0 },  // RIGHT
            { x: 0, y: 1 },  // DOWN
            { x: -1, y: 0 }  // LEFT
        ];
        const path = [];

        while (queue.length > 0) {
            const current = queue.shift();

            if (current.x === end.x && current.y === end.y) {
                let node = current;
                while (node) {
                    path.unshift({ x: node.x * this.gridSize, y: node.y * this.gridSize });
                    node = node.parent;
                    //node.next. = nextposition;
                }
                return path;
            }

            for (const dir of direction) {
                const neighbor = { x: current.x + dir.x, y: current.y + dir.y };

                if (neighbor.x >= 0 && neighbor.x < this.grid[0].length &&
                    neighbor.y >= 0 && neighbor.y < this.grid.length &&
                    !visited.has(`${neighbor.x},${neighbor.y}`)) {
                    neighbor.parent = current;
                    queue.push(neighbor);
                    visited.add(`${neighbor.x},${neighbor.y}`);
                }
            }
        }

        return [{ x: end.x * this.gridSize, y: end.y * this.gridSize }];
    }
    //--------------------------------------------------------------------------------------------------------------------------
    // scale all variables as changing screen size
    resize(width, height) {

        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.font = '25px Bungee';
        this.ctx.textAlign = 'right';
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'white';
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ratio = this.height / this.baseHeight;

        this.gravity = 0.15 * this.ratio;
        this.speed = 3 * this.ratio;
        this.minSpeed = this.speed;
        this.maxSpeed = this.speed * 5;
        this.background.resize();
        this.player.resize();
        this.createObstacles();
        this.obstacles.forEach(obstacles => {
            obstacles.resize();
        });
        this.rockets.forEach(rocket => {
            rocket.resize();
        });
        this.score = 0;
        this.gameOver = false;
        this.timer = 0;

    }
    render(deltaTime) {

        if (!this.gameOver) {
            this.timer += deltaTime;
            this.audio.playMainTheme();
        }
 
        this.handlePeriodicEvent(deltaTime);
        this.background.update();
        this.background.draw();
        this.drawStatusText();
        this.player.update();
        this.player.draw();
        if (this.gameOver) {
            return;
        }
        this.updateRocketSprawn(deltaTime);
        this.obstacles.forEach(obstacles => {
            obstacles.update();
            obstacles.draw();
        })
        this.rockets.forEach(rocket => {
            rocket.update();
            rocket.draw();
        });

    }

    updateRocketSprawn(deltaTime) {

        this.rocketSpawnTimer += deltaTime;

        const rocketsOnScreen = this.rockets.filter(rocket => !rocket.markedForDeletion);

        if (this.rocketSpawnTimer >= this.rocketSpawnInterval && rocketsOnScreen.length === 0) {
            this.spawnRocket();
            this.rocketSpawnTimer = 0;
        }

        // Remove rockets that are marked for deletion
        this.rockets = this.rockets.filter(rocket => !rocket.markedForDeletion);
        }
    
    

    spawnRocket() {
        const newRocket = new Rocket(this);
        this.rockets.push(newRocket);
    }

    createObstacles() {
        this.obstacles = [];
        const firstX = this.baseHeight * this.ratio;
        const obstacleSpacing = 400 * this.ratio;
        for (let i = 0; i < this.numberOfObstacles; i++) {
            this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
        }
    }
    checkCollision(a, b) {
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dx, dy);
        const sumOfRadii = a.collisionRadius + b.collisionRadius;
        return distance <= sumOfRadii;
    }
    formatTimer() {
        return (this.timer * 0.001).toFixed(1);
    }

    handlePeriodicEvent(deltaTime) {
        if (this.eventTimer < this.eventInterval)
            this.eventTimer += deltaTime;
        else {
            this.eventTimer = this.eventInterval % this.eventTimer;
            this.eventUpdate = true;
        }
    }
    drawStatusText() {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("Score: " + this.score, this.width - 10, 30);
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText("Timer: " + this.formatTimer(), 10, 30);
        if (this.gameOver) {
            if (this.player.collided) {
                this.audio.hit.play();
                this.audio.gameOver.play();
                this.message1 = "Getting rusty?";
                this.message2 = "Collision time is " + this.formatTimer() + " seconds";
                this.message3 = "Your score is " + this.score + " points";
            } else if (this.obstacles.length <= 0) {
                this.audio.win.play();
                this.message1 = "You nailed it!";
                this.message2 = "Can you do it faster than " + this.formatTimer() + " seconds?";
                this.message3 = "Your score is " + this.score + " points";
            } else if (this.player.isTouchingBottom) {
                this.message1 = "Are you OK?";
                this.message2 = "Can you do it better than " + this.formatTimer() + " seconds?";
                this.message3 = "Your score is " + this.score + " points";
            }
            this.ctx.textAlign = 'center';
            this.ctx.font = '80px Bungee';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(this.message1, this.width * 0.5, this.height * 0.5 - 40);
            this.ctx.font = '25px Bungee';
            this.ctx.fillStyle = 'red';
            this.ctx.fillText(this.message3, this.width * 0.5, this.height * 0.5 - 5);
            this.ctx.font = '25px Bungee';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(this.message2, this.width * 0.5, this.height * 0.5 + 22);
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillText("Press 'R' to try again!", this.width * 0.5, this.height * 0.5 + 50);
        }
        if (!this.gameOver) {
            if (this.player.energy <= 20) this.ctx.fillStyle = 'red';
            else if (this.player.energy > 20 && this.player.energy <= 50) this.ctx.fillStyle = 'orange';
            else this.ctx.fillStyle = 'green';
            for (let i = 0; i < this.player.energy; i++) {
                this.ctx.fillRect(10, this.height - 10 - i * this.player.barSize, this.player.barSize * 3, this.player.barSize * 1.5);
            }
        }

        this.ctx.restore();
    }
}

//--------------------------------------------------------------------------------------------------------------------------

window.addEventListener("load", function () {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);

    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(deltaTime);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});