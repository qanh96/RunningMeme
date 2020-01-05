export default {
  /*
   * units
   * ppf: pixels per frame
   * fpa: frames per action
   */
  settings: {
    bgSpeed: 6, // ppf
    birdSpeed: 7.2, // ppf
    birdSpawnRate: 240, // fpa
    birdWingsRate: 15, // fpa
    cactiSpawnRate: 50, // fpa
    cloudSpawnRate: 200, // fpa
    cloudSpeed: 2, // ppf
    dinoGravity: 0.5, // ppf
    dinoLegsRate: 6, // fpa
    dinoLift: 10, // ppf
    scoreIncreaseRate: 6, // fpa
    hitboxOffset: 1.1 // higher -> easier to evade collision
  },
  sprites: {
    birdUp: { h: 52, w: 84, x: 708, y: 31 },
    birdDown: { h: 60, w: 84, x: 708, y: 85 },
    cactus: { h: 92, w: 46, x: 70, y: 31 },
    cactusDouble: { h: 66, w: 64, x: 118, y: 31 },
    cactusDoubleB: { h: 92, w: 80, x: 184, y: 31 },
    cactusTriple: { h: 66, w: 82, x: 266, y: 31 },
    cloud: { h: 28, w: 92, x: 794, y: 31 },
    dino: { h: 86, w: 80, x: 350, y: 31 },
    dinoDuckLeftLeg: { h: 52, w: 110, x: 596, y: 31 },
    dinoDuckRightLeg: { h: 52, w: 110, x: 596, y: 85 },
    dinoLeftLeg: { h: 86, w: 80, x: 432, y: 31 },
    dinoRightLeg: { h: 86, w: 80, x: 514, y: 31 },
    ground: { h: 28, w: 2400, x: 0, y: 2 },
    replayIcon: { h: 60, w: 68, x: 0, y: 31 },
    f_nyanBalloonUp: { h: 86, w: 44, x: 49, y: 441 },
    f_nyanBalloonDown: { h: 86, w: 44, x: 93, y: 441 },
    f_nyanOriginalUp: { h: 60, w: 97, x: 627, y: 147 },
    f_nyanOriginalDown: { h: 60, w: 97, x: 724, y: 147 },
    f_nyanFloppyUp: { h: 60, w: 85, x: 314, y: 235 },
    f_nyanFloppyDown: { h: 60, w: 85, x: 399, y: 235 },
    m_dawei: { h: 86, w: 116, x: 179, y: 147 },
    m_daweiDuckLeftLeg: { h: 52, w: 56, x: 484, y: 235 },
    m_daweiDuckRightLeg: { h: 52, w: 56, x: 484, y: 235 },
    m_daweiRightLeg: { h: 86, w: 116, x: 295, y: 147 },
    m_daweiLeftLeg: { h: 86, w: 116, x: 411, y: 147 },
    o_mrMeeseek: { h: 92, w: 49, x: 0, y: 441 },
    o_meow: { h: 76, w: 82, x: 232, y: 235 },
    o_snorlax: { h: 100, w: 79, x: 0, y: 341 },
    o_caveman: { h: 66, w: 100, x: 527, y: 147 },
    o_meowCaveman: { h: 88, w: 179, x: 0, y: 147 },
    o_cavemanSnorlax: { h: 106, w: 149, x: 0, y: 235 },
    o_meow_a: { h: 41, w: 68, x: 931, y: 147 },
    o_meow_b: { h: 49, w: 110, x: 821, y: 147 },
    o_meowMee: { h: 94, w: 86, x: 146, y: 235 },
    j_doodleJump: { h: 66, w: 100, x: 79, y: 341 },
    j_mario: { h: 66, w: 51, x: 153, y: 341 }
  }
}
