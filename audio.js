
class Audio {
   
    constructor() {
        this.charge = document.getElementById("charge");
        this.flap = document.getElementById("flap");
        this.gameOver = document.getElementById("gameover");
        this.hit = document.getElementById("hit");
        this.mainTheme = document.getElementById("mainTheme");
        this.startGame = document.getElementById("start");
        this.win = document.getElementById("win");
        this.crash = document.getElementById("crash");
        this.mainThemeStopTimer = 0;
        this.mainThemeStopped = false;


    }
  
    playMainTheme() {
          this.mainTheme.play();
          this.mainTheme.loop = true;
  }
    stopMainTheme() {
        this.mainTheme.pause();
        this.mainTheme.currentTime = 0;
}
}