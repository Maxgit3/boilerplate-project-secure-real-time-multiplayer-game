class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
 
    switch(dir) {
      case 'ArrowUp':
        this.y -= speed;
        break;
      case 'ArrowDown':
        this.y += speed;
        break;
      case 'ArrowLeft':
        this.x -= speed;
        break;
      case 'ArrowRight':
        this.x += speed;
        break;
      case 'w':
        this.y -= speed;
        break;
      case 's':
        this.y += speed;
        break;
      case 'a':
        this.x -= speed;
        break;
      case 'd':
        this.x += speed;
        break;  
    }
  }

  collision(item) {

  }

  calculateRank(arr) {

  }
}

export default Player;
