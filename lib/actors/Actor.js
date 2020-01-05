import config from '../config.js';

export default class Actor {
  constructor () {
    this._sprite = null;
    this.height = 0;
    this.width = 0;
    this.offset = config.settings.hitboxOffset;
  }

  set sprite (name) {
    this.height = config.sprites[name].h / 2;
    this._sprite = name;
    this.width = config.sprites[name].w / 2;
  }

  get sprite () {
    return this._sprite;
  }

  hits (actors) {
    return actors
      .filter(Boolean)
      .some(actor => {
        if (this.x >= (actor.x + actor.width*this.offset) || actor.x >= (this.x + this.width*this.offset)) {
          return false;
        }

        if (this.y >= (actor.y + actor.height*this.offset) || actor.y >= (this.y + this.height*this.offset)) {
          return false;
        }

        return true;
      });
  }
}
