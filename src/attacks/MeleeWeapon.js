import Phaser from 'phaser';
import SpriteEffect from '../effects/SpriteEffect';
import EffectManager from '../effects/EffectManager';
class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,weaponName) {
    super(scene,x,y,weaponName);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 300;
    this.damage = 15;
    this.cooldown = 300;
    this.wielder = null;
    this.weaponName = weaponName;
    this.setOrigin(0.5, 1);

    this.weaponAnim = weaponName + '-swing';
    this.effectManager = new EffectManager(this.scene);
    this.activateWeapon(false);
    this.on('animationcomplete', animation => {
      if (animation.key === this.weaponAnim) {
        this.activateWeapon(false);
        this.body.reset(0,0);
        this.body.checkCollision.none = false;
      }
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time,delta);

    if (!this.active) {return;}

    const center = this.wielder.getCenter();
    let centerX;

    if (this.wielder.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      this.setFlipX(false);
      centerX = center.x+17;
    } else {
      this.setFlipX(true);
      centerX = center.x-17;
    }
    this.body.reset(centerX,this.wielder.y);
  }

  swing(wielder) {
    this.activateWeapon(true);

    this.wielder = wielder;

    this.anims.play(this.weaponAnim, true);


  }

  activateWeapon(isActive) {
    this.setActive(isActive);
    this.setVisible(isActive);
  }

  deliveredHit(target) {
    const impactPosition = {x: this.x, y:this.getRightCenter().y};
    this.effectManager.playEffectOn('explosion', target, impactPosition);
    this.body.checkCollision.none = true;
  }

}

export default MeleeWeapon;
