import _ from "underscore";
import world from "../common/world.js";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

class Player {
  constructor(playerId) {
    const stageLeft = 100;
    const stageRight = 1200;
    const center = (stageLeft + stageRight) / 2.0;
    this.name = "anonymous";
    this.id = playerId;
    this.x = _.random(100, 1200);
    this.y = -700;
    this.velocityY = 0;
    this.velocityX = 0;
    this.direction = 1;
    this.falling = true;
    if(this.x > center) this.direction = -1;
    this.state = "jumping";
    this.deathState = null;
    this.deathCountdown = null;
  }
  
  isStanding() { 
    return this.state == "standing" 
  }
  
  isJumping() { 
    return this.state == "jumping" 
  }
  
  isKicking() { 
    return this.state == "kicking" 
  }
  
  isDying() { 
    return this.state == "dying" 
  }
  
  jump(velocityX, velocityY) {
    this.state = "jumping";
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }
  
  up() {
    if(this.isDying()) return;
    if(!this.isStanding()) return;
    this.jump(0, world.jumpPower);
    this.velocityX = 0;
  }

  left() {
    if(this.isDying()) return;
    if(this.isKicking()) return;
    this.direction = -1;
    if(!this.isJumping()) return;
    this.state = "kicking";
  }
  
  right() {
    if(this.isDying()) return;
    if(this.isKicking()) return;
    this.direction = 1;
    if(!this.isJumping()) return;
    this.state = "kicking";
  }

  down() {
    if(this.isDying()) return;
    if(!this.isStanding()) return;
    this.jump(world.backPedalX * this.direction, world.backPedalY);
  }
  
  boxes() {
    if(this.isDying()) return null;
    const boxesForUser = clone(world.boxes[this.direction][this.state]);

    _.each(boxesForUser, function(box) {
      box.x += this.x;
      box.x2 += this.x;
      box.y += this.y;
      box.y2 += this.y;
    }, this);

    return boxesForUser;
  }

  foot() {
    if(!this.isKicking()) return null;

    return _.last(this.boxes(world.boxes));
  }
  
  head() {
    return _.first(this.boxes(world.boxes));
  }
}

export {Player};
