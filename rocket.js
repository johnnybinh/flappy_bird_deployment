class Rocket{
    constructor(game, startX, startY){
        this.game = game;
        this.x = startX;
        this.y = startY;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        thisCloseToPlayer = false;
        this.path = [];
        this.gridSize = this.game.gridSize;
        this.bfs();
    }

    draw(){
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(){
        if(this.path.length > 0){
            const nextPosition = this.path.shift();
            this.x = nextPosition.x;
            this.y = nextPosition.y;
        }else{
            this.isCloseToPlayer = true;
        }

        if(this.isCloseToPlayer){
            this.x += this.speed *2;
        }
        if(this.x > this.game.width || this.x < -this.width){
            this.markedForDeletion = true;
        }
    }
    
}