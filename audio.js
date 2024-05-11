
class Audio {
   
    constructor() {
        this.charge = document.getElementById("charge");
        this.flap = document.getElementById("flap");
        this.gameOver = document.getElementById("gameover");
        this.hit = document.getElementById("hit");
        this.mainTheme = document.getElementById("mainTheme");
        this.startGame = document.getElementById("start");
        this.win = document.getElementById("win");

    }
  
    playMainTheme() {
          this.mainTheme.play();
          this.mainTheme.loop = true;
  }
}