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
    if (this.x < item.x + 20 &&
      this.x + 20 > item.x &&
      this.y < item.y + 20 &&
      this.y + 20 > item.y) {
        this.score += item.value;
        return true;
    }
    return false;
  }

  calculateRank(arr) {
    arr.sort((a, b) => b.score - a.score);
    let currentRank = arr.findIndex(p => p.id === this.id) + 1;
    return `Rank: ${currentRank} / ${arr.length}`;
  }
}

export default Player;
