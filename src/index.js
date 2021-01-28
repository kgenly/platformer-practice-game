import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import PreloadScene from './scenes/PreloadScene';

const MAP_WIDTH = 1600;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 600;
const ZOOMFACTOR = 1.5;
const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOMFACTOR,
  debug: true,
  leftTopCorner: {
    x: ((WIDTH - (WIDTH / ZOOMFACTOR)) /2),
    y: (HEIGHT - (HEIGHT / ZOOMFACTOR)) /2
  },
  leftBottomCorner: {
    x: ((WIDTH - (WIDTH / ZOOMFACTOR)) /2),
    y: ((HEIGHT/ZOOMFACTOR) + ((HEIGHT - (HEIGHT / ZOOMFACTOR)) /2)),
  },
  rightTopCorner: {
    x: ((WIDTH/ZOOMFACTOR) + ((WIDTH - (WIDTH / ZOOMFACTOR)) /2)),
    y: (HEIGHT - (HEIGHT / ZOOMFACTOR)) /2
  },
  rightBottomCorner: {
    x: ((WIDTH/ZOOMFACTOR) + ((WIDTH - (WIDTH / ZOOMFACTOR)) /2)),
    y: ((HEIGHT/ZOOMFACTOR) + ((HEIGHT - (HEIGHT / ZOOMFACTOR)) /2)),
  }
}

const Scenes = [PreloadScene, PlayScene];
const createScene = (Scene)=> new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);
const config = {
    //WebGL
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    pixelArt: true,
    physics: {
      //Arcade physics plugin, manages physics simulation
      default: 'arcade',
      arcade: {
        debug: SHARED_CONFIG.debug
      //  gravity: {y:300}
      }
    },
    scene: initScenes()
}


new Phaser.Game(config);
