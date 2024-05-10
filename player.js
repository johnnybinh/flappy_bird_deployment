class Player{
    constructor(game){
        this.game = game;
        this.x = 50;
        this.y;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.collisionX;
        this.collisionY;
        this.collisionRadius;
        this.height;
        this.speedY;
        this.flapSpeed;
        this.collided;
        this.energy = 30;
        this.maxEnergy = this.energy* 2;
        this.minEnregy = 15
        this.charging;
        this.barSize;
        this.image = document.getElementById("player");
        this.frameY;
    }
    draw(){
        this.game.ctx.drawImage(this.image, 0, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.game.ctx.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI*2);
        //this.game.ctx.stroke();
    }

    update(){
        this.handleEnergy();
        if(this.speedY >= 0) this.wingsUp();
        this.y += this.speedY;
        this.collisionY = this.y + this.height * 0.5;
        if(this.y < this.game.height - this.height){
            this.y +=this.game.gravity;
            this.speedY += this.game.gravity;
        }
        for (let i = 0; i < this.game.obstacles.length; i++) {
            const obstacle = this.game.obstacles[i];
            if (this.game.checkCollision(this, obstacle)) {
              this.collided = true; 
              this.getHit(); 
              // Handle collision logic (e.g., decrease energy, play sound effect)
            }
          }
        //bottom boudary
        if(this.isTouchingBottom()){
            this.y = this.game.height -this.height;
            this.game.gameOver = true;
            this.getHit();        
        }
    }

    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height*0.5 - this.height*0.5;
        this.speedY = -8 * this.game.ratio;
        this.flapSpeed = 5*this.game.ratio;
        this.collisionRadius = 40 * this.game.ratio;
        this.collisionX = this.x + this.width * 0.5;
        this.collided = false;
        this.barSize = Math.floor(10*this.game.ratio);
        this.energy = 30;
        this.frameY = 0;
        this.charging = false;
    }   

    isTouchingTop(){
        return this.y <=0;
    }
    isTouchingBottom(){
        return this.y >= this.game.height - this.height;
    }
    startCharge(){
        this.charging = true;
        this.game.speed = this.game.maxSpeed;
        this.wingsCharge();
    }
    stopCharge(){
        this.charging = false;
        this.game.speed = this.game.minSpeed;
    }
    handleEnergy(){
        if(this.game.eventUpdate){
          if(this.energy < this.maxEnergy){
             this.energy += 0.09;
         }
         if(this.charging){
             this.energy -= 1;
             if(this.energy <= 0 ){
                 this.energy = 0 ; 
                 this.stopCharge();
            }
          }
        }
     }

    flap(){
        this.stopCharge();
        if(!this.isTouchingTop()){
        this.speedY = -this.flapSpeed; 
        this.wingsDown();
        }
    }
//------------------------------------------------------------------------------
// helper methods

    wingsIdle(){
         this.frameY = 0;
    }
    wingsDown(){
        if(!this.charging) this.frameY = 1;
    }
    wingsUp(){
        if(!this.charging) this.frameY = 2;
    }
    wingsCharge(){
       this.frameY = 3;
    }
    getHit(){
        this.frameY = 4;
    }

}
