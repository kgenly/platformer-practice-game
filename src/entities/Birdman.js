import Phaser from 'phaser';
import Enemy from './Enemy';
import initAnimations from './animations/birdmanAnims';


class Birdman extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'birdman');

    initAnimations(this.scene.anims);
  }

  init() {
    super.init();
    this.damage = 20;
    this.setSize(20, 43);
    this.setOffset(10,22);
  }

  update(time, delta) {
    super.update(time,delta);

    if (!this.active) {return;}
    if (this.isPlayingAnim('birdman_hurt')) {
      return;
    }
    this.play('birdman_idle', true);
  }

  takesHit(source) {
    super.takesHit(source);

    this.play('birdman_hurt', false);
  }

}

export default Birdman;
