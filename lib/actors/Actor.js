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
        if (this.x*this.offset >= (actor.x + actor.width) || actor.x*this.offset >= (this.x + this.width)) {
          return false;
        }

        if (this.y >= (actor.y*this.offset + actor.height) || actor.y*this.offset >= (this.y + this.height)) {
          return false;
        }

        return true;
      });
  }
}
