import Actor from './Actor.js';
import config from '../config.js';
import { randInteger, randItem, randBoolean } from '../utils.js';


const VARIANTS = ['j_doodle','j_mario']


export default class Jumper extends Actor {

  constructor (canvasWidth, canvasHeight) {
    super();

    this.sprite = randItem(VARIANTS)
    this.jumperGravity = randInteger(10, config.settings.jumperGravity*10)/10;
    this.jumperLift = randInteger(3, config.settings.jumperLift);
    this.jumperSpeed = randInteger(4, config.settings.jumperSpeed);
    console.log(this.sprite)
    this.canvasHeight = canvasHeight;
    this.x = canvasWidth;
    this.relativeY = 0;
    this.velocity = 0;
  }

  get y () {
    return this.canvasHeight - this.height + this.relativeY;
  }

  nextFrame () {
    this.x -= this.jumperSpeed;
    this.jump();
    // use gravity to gradually decrease velocity
    this.velocity += this.jumperGravity;
    this.relativeY += this.velocity;

    // stop falling once back down to the ground
    if (this.relativeY > 0) {
      this.velocity = 0;
      this.relativeY = 0;
      // jump_lock = false;
    } 
    // this.determineSprite()
  }

  determineSprite () {
    // this.sprite = 'j_mario';
  }

  jump () {
    if (this.relativeY === 0) {
      this.velocity = -this.jumperLift;
      return true;
    }
    else{
      return false;
    }
  }
}
