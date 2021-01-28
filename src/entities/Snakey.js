import Phaser from 'phaser';
import Enemy from './Enemy';
import initAnimations from './animations/snakeyAnims';


class Snakey extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'snakey');

    initAnimations(this.scene.anims);
  }

  init() {
    super.init();
    this.damage = 20;
    this.velocity = 30;
    this.health = 50;
    this.setSize(this.width -10, this.height-10);
    this.setOffset(5,10);
  }

  update(time, delta) {
    super.update(time,delta);

    if (!this.active) {return;}
    if (this.isPlayingAnim('snakey_hurt')) {
      return;
    }
    this.play('snakey_idle', true);
  }

  takesHit(source) {
    super.takesHit(source);

    this.play('snakey_hurt', false);
  }

}

export default Snakey;
