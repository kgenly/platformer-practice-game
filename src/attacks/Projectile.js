import Phaser from 'phaser';
import SpriteEffect from '../effects/SpriteEffect';
import EffectManager from '../effects/EffectManager';
class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,key) {
    super(scene,x,y,key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.maxDistance = 200;
    this.cooldown = 500;
    this.travelDistance = 0;
    this.damage = 10;
    this.body.setSize(this.width -13, this.height -20);
    this.effectManager = new EffectManager(this.scene);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.travelDistance += this.body.deltaAbsX();
    if (this.isOutOfRange()) {
      //this.destroy();
      this.body.reset(0,0);
      this.travelDistance = 0;
      this.activateProjectile(false);
    }
  }
  fire(x,y) {
    this.activateProjectile(true);
    this.body.reset(x,y);
    this.setVelocityX(this.speed);
  }

  deliveredHit(target) {
    this.activateProjectile(false);
    const impactPosition = {x: this.x, y:this.y};


    this.body.reset(0,0);
    this.travelDistance = 0;
    this.effectManager.playEffectOn('explosion', target, impactPosition);
  }

activateProjectile(isActive) {
  this.setActive(isActive);
  this.setVisible(isActive);
}
  isOutOfRange() {
    return this.travelDistance &&
    this.travelDistance >= this.maxDistance;
  }
}

export default Projectile;
