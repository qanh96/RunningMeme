import Actor from './Actor.js';
import config from '../config.js';
import { randInteger, randItem, randBoolean } from '../utils.js';

const VARIANTS = ['j_mario', 'j_doodleJump']


export default class Jumper extends Actor {

  constructor (canvasWidth, canvasHeight) {
    super();

    this.sprite = randItem(VARIANTS)
    this.canvasHeight = canvasHeight;
    this.x = canvasWidth;
    this.relativeY = 0;
    this.velocity = 0;
  }

  get y () {
    return this.canvasHeight - this.height + this.relativeY;
  }

  nextFrame () {
    this.x -= config.settings.bgSpeed;
    this.jump();
    // use gravity to gradually decrease velocity
    this.velocity += config.settings.dinoGravity;
    this.relativeY += this.velocity;

    // stop falling once back down to the ground
    if (this.relativeY > 0) {
      this.velocity = 0;
      this.relativeY = 0;
      jump_lock = false;
    } 
    this.determineSprite()
  }

  determineSprite () {
    this.sprite = 'j_mario';
  }

  jump () {
    if (this.relativeY === 0) {
      this.velocity = -config.settings.dinoLift;
      return true;
    }
    else{
      return false;
    }
  }
}
