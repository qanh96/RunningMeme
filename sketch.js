// function setup() {
//   // put setup code here
//   createCanvas(640, 480);
// }

// function draw() {
//   // put drawing code here
//   if (mouseIsPressed) {
//     fill(0);
//   } else {
//     fill(255);
//   }
//   ellipse(mouseX, mouseY, 80, 80);
// }

/* jslint esversion: 9 */

import Bird from './lib/actors/Bird.js';
import Cactus from './lib/actors/Cactus.js';
import Cloud from './lib/actors/Cloud.js';
import config from './lib/config.js';
import Dino from './lib/actors/Dino.js';
import { randBoolean } from './lib/utils.js';

const { p5: P5 } = window;
window.config = config;

// eslint-disable-next-line no-new
new P5(p5 => {
  // for resetting settings that change due to
  // difficulty increasing
  const SETTINGS_BACKUP = { ...config.settings };
  const STATE = {
    birds: [],
    cacti: [],
    clouds: [],
    dino: null,
    gameOver: false,
    groundX: 0,
    groundY: 0,
    isRunning: false,
    level: 0,
    score: 0
  };
  // eslint-disable-next-line no-unused-vars
  let PressStartFont, sprite;

  // global references for debugging
  window.p5 = p5;
  window.state = STATE;

  // checkbox for slecting mode
  let micInputCheckbox = null;
  // boolean var to flag Mode
  let enableMicInput = false;
  // pointer to AudioInput (Microphone)
  let mic = null;
  // var number to store timestamp(EPOCH milis)
  let ts = 0;
  // min Interval in Ms between Jump(for double jump with sound control)
  let minInterval = 100;
  // Slider to control the Threshold
  let slider;
  // sound when Jump
  let jumpSound = null;
  // sound for GameOver
  let gameOverSound = null;

  function spriteImage (spriteName, ...clientCoords) {
    const { h, w, x, y } = config.sprites[spriteName];

    // eslint-disable-next-line no-useless-call
    return p5.image.apply(p5, [sprite, ...clientCoords, w / 2, h / 2, x, y, w, h]);
  }

  function resetGame () {
    Object.assign(STATE, {
      birds: [],
      cacti: [],
      dino: new Dino(p5.height),
      gameOver: false,
      isRunning: true,
      level: 0,
      score: 0
    });

    Object.assign(config.settings, SETTINGS_BACKUP);
    p5.loop();

    if(gameOverSound.isPlaying()){
      gameOverSound.stop();
    }
  }

  function endGame () {
    const iconSprite = config.sprites.replayIcon;
    const padding = 15;

    p5.fill('#535353');
    p5.textAlign(p5.CENTER);
    p5.textFont(PressStartFont);
    p5.textSize(12);
    p5.text('G A M E  O V E R', (p5.width / 2), (p5.height / 2 - p5.textSize() / 2 - padding));
    spriteImage('replayIcon', (p5.width / 2 - iconSprite.w / 4), (p5.height / 2 - iconSprite.h / 4 + padding));

    STATE.isRunning = false;
    p5.noLoop();
  }

  function increaseDifficulty () {
    const { settings } = config;
    const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings;
    const { level } = STATE;

    if (level > 4 && level < 8) {
      settings.bgSpeed++;
      settings.birdSpeed = settings.bgSpeed * 0.8;
    } else if (level > 7) {
      settings.bgSpeed = Math.ceil(bgSpeed * 1.1);
      settings.birdSpeed = settings.bgSpeed * 0.9;
      settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.98);

      if (level > 7 && level % 2 === 0 && dinoLegsRate > 3) {
        settings.dinoLegsRate--;
      }
    }
  }

  function updateScore () {
    if (p5.frameCount % config.settings.scoreIncreaseRate === 0) {
      const oldLevel = STATE.level;

      STATE.score++;
      STATE.level = Math.floor(STATE.score / 100);

      if (STATE.level !== oldLevel) {
        increaseDifficulty();
      }
    }
  }

  function drawGround () {
    const { bgSpeed } = config.settings;
    const groundImgWidth = config.sprites.ground.w / 2;

    spriteImage('ground', STATE.groundX, STATE.groundY);
    STATE.groundX -= bgSpeed;

    // append second image until first is fully translated
    if (STATE.groundX <= -groundImgWidth + p5.width) {
      spriteImage('ground', (STATE.groundX + groundImgWidth), STATE.groundY);

      if (STATE.groundX <= -groundImgWidth) {
        STATE.groundX = -bgSpeed;
      }
    }
  }

  function drawClouds () {
    const { clouds } = STATE;

    for (let i = clouds.length - 1; i >= 0; i--) {
      const cloud = clouds[i];

      cloud.nextFrame();

      if (cloud.x <= -cloud.width) {
        // remove if off screen
        clouds.splice(i, 1);
      } else {
        spriteImage(cloud.sprite, cloud.x, cloud.y);
      }
    }

    if (p5.frameCount % config.settings.cloudSpawnRate === 0) {
      clouds.push(new Cloud(p5.width));
    }
  }

  function drawDino () {
    const { dino } = STATE;

    if (dino) {
      dino.nextFrame();
      spriteImage(dino.sprite, dino.x, dino.y);
    } else {
      spriteImage('dino', 25, (p5.height - (config.sprites.dino.h / 2) - 4));
    }
  }

  function drawCacti () {
    const { cacti } = STATE;

    for (let i = cacti.length - 1; i >= 0; i--) {
      const cactus = cacti[i];

      cactus.nextFrame();

      if (cactus.x <= -cactus.width) {
        // remove if off screen
        cacti.splice(i, 1);
      } else {
        spriteImage(cactus.sprite, cactus.x, cactus.y);
      }
    }

    if (p5.frameCount % config.settings.cactiSpawnRate === 0) {
      // randomly either do or don't add cactus
      if (randBoolean()) {
        cacti.push(new Cactus(p5.width, p5.height));
      }
    }
  }

  function drawScore () {
    p5.strokeWeight(0);
    p5.stroke(51);
    p5.fill('#535353');
    p5.textAlign(p5.RIGHT);
    p5.textFont(PressStartFont);
    p5.textSize(12);
    p5.text((STATE.score + '').padStart(5, '0'), p5.width, p5.textSize());
  }

  function drawBirds () {
    const { birds } = STATE;

    for (let i = birds.length - 1; i >= 0; i--) {
      const bird = birds[i];

      bird.nextFrame();

      if (bird.x <= -bird.width) {
        // remove if off screen
        birds.splice(i, 1);
      } else {
        spriteImage(bird.sprite, bird.x, bird.y);
      }
    }

    if (p5.frameCount % config.settings.birdSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        birds.push(new Bird(p5.width, p5.height));
      }
    }
  }

  function toogleMicInput() {
    if (micInputCheckbox.checked()) {
      console.log('enable Mic Input!');
      enableMicInput = true;
    } else {
      console.log('disable Mic Input!');
      enableMicInput = false;
    }
  }

  function drawVolume(){
    let vol = mic.getLevel();
    p5.strokeWeight(3);
    p5.stroke(vol*255, 255-vol*255, 0);
    p5.line(0, 5, (0 + 100*vol), 5 );
  }

  function playJumpSound(){
    if (jumpSound.isPlaying()) {
      // .isPlaying() returns a boolean
      jumpSound.stop();
      jumpSound.play();
    } else {
      jumpSound.play();
    }
  }

  function soundControl() {
     // Get the overall volume (between 0 and 1.0)
    let vol = mic.getLevel();
    let threshold = slider.value() / 100; 
    if(enableMicInput && mic != null) {
      // Calculate interval between jump to enable double jump (TODO: still need to optimize!!!)
      let intervalBtwJumps = Date.now() - ts;
      if (vol > threshold && STATE.isRunning && intervalBtwJumps > 100) {
        STATE.dino.doubleJump();
        playJumpSound();
        ts = Date.now(); 
      }
    }
  }

  // triggered on pageload
  p5.preload = () => {
    PressStartFont = p5.loadFont('assets/PressStart2P-Regular.ttf');
    sprite = p5.loadImage('assets/sprite.png');
  };

  // triggered after preload
  p5.setup = () => {
    // Create checkbox
    micInputCheckbox = p5.createCheckbox('Enable Mic Input (with double jump)', false);
    micInputCheckbox.changed(toogleMicInput);
    // Create jumpSound + gameOverSound
    jumpSound = p5.loadSound('./lib/sound/maro-jump-sound-effect_1.mp3');
    gameOverSound = p5.loadSound('./lib/sound/sega-rally-15-game-over-yeah1.mp3');
    //jumpSound.volume(0.5);

    // Create Slider for Threshold
    slider = p5.createSlider(0, 100, 10, 1);
    slider.style('width','100px');
    //Create an Audio input
    mic = new P5.AudioIn();
    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();
    ts = Date.now();

    const canvas = p5.createCanvas(600, 150);

    STATE.groundY = p5.height - config.sprites.ground.h / 2;
    p5.noLoop();

    canvas.mouseClicked(() => {
      if (STATE.gameOver) {
        resetGame();
      }
    });
  };

  // triggered for every frame
  p5.draw = () => {
    p5.background('#f7f7f7');
    drawVolume();
    drawGround();
    drawClouds();
    drawDino();
    drawCacti();
    drawScore();


    if (STATE.level > 3) {
      drawBirds();
    }

    if (STATE.dino && STATE.dino.hits([STATE.cacti[0], STATE.birds[0]])) {
      STATE.gameOver = true;
    }

    if (STATE.gameOver) {
      endGame();
      gameOverSound.play();
    } else {
      updateScore();
    }

    soundControl();
  };

  p5.keyPressed = () => {
    if (p5.key === ' ' || p5.keyCode === p5.UP_ARROW) {
      if (STATE.isRunning) {
        if(STATE.dino.jump()){
          playJumpSound();
        }
      } else {
        resetGame();
      }
    } else if (p5.keyCode === p5.DOWN_ARROW) {
      if (STATE.isRunning) {
        STATE.dino.duck(true);
      }
    }
  };

  p5.keyReleased = () => {
    if (p5.keyCode === p5.DOWN_ARROW) {
      STATE.dino.duck(false);
    }
  };
});

