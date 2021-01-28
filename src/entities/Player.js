import Phaser from 'phaser';
import initAnimations from './animations/playerAnims';
import collidable from '../mixins/collidable';
import anims from '../mixins/anims';
import HealthBar from '../hud/HealthBar';
import Projectiles from '../attacks/Projectiles';
import MeleeWeapon from '../attacks/MeleeWeapon';
import {getTimestamp} from '../utils/functions';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, image) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.config = scene.config;

    //Mixins
    Object.assign(this, collidable);
    Object.assign(this, anims);

    this.init();
    this.initEvents();
  }

  init() {
    this.setGravityY(500);
    this.setOrigin(0.5,1);
    this.setCollideWorldBounds(true);
    this.setSize(20, 35);
    this.setOffset(7,3);
    this.hasBeenHit = false;
    this.bounceVelocity =200;
    this.jumpCount = 0;
    this.consecutiveJumpsAllowed = 1;
    this.maxHP = 100;
    this.timeFromLastSwing = null;

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

    this.hp = new HealthBar(this.scene, this.config.leftTopCorner.x+20, this.config.leftTopCorner.y+20, 2, this.maxHP);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.playerVelocity = 200;

    this.projectiles = new Projectiles(this.scene);
    this.meleeWeapon = new MeleeWeapon(this.scene, 0,0, 'sword_default');

    initAnimations(this.scene.anims);

    this.scene.input.keyboard.on('keydown-Q', ()=>{
      this.play('throw', true);
      this.projectiles.fireProjectile(this);
    });

    this.scene.input.keyboard.on('keydown-E', ()=>{
      if (this.timeFromLastSwing && this.timeFromLastSwing + this.meleeWeapon.cooldown > getTimestamp()) {
        return;
      } else {
        this.timeFromLastSwing = getTimestamp();
        this.play('throw', true);
        this.meleeWeapon.swing(this);
      }
    });
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time, delta) {
    super.preUpdate(time, delta);
    const {left, right, space, up} = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = this.body.onFloor();

    if (this.hasBeenHit) { return; }

    if (left.isDown) {
      this.setVelocityX(0 - this.playerVelocity);
      this.setFlipX(true);
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    } else if (right.isDown) {
      this.setVelocityX(this.playerVelocity);
      this.setFlipX(false);
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    } else {
      this.setVelocityX(0);
    }

    if ((isSpaceJustDown || isUpJustDown) && (onFloor || this.consecutiveJumpsAllowed > this.jumpCount)) {
      this.setVelocityY(-this.playerVelocity*1.5);
      this.jumpCount++;
    }

    if (onFloor) {
      this.jumpCount = 0;
    }

    if (this.isPlayingAnim('throw')) {
      return;
    }


    //don't play it again if it's already playing
    //Second value -> IgnoreIfPlaying
    onFloor ?
      this.body.velocity.x !== 0 ?
        this.play('run', true) : this.play('idle', true) :
      this.play('jump', true);
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 150,
      repeat: -1,
      tint: 0xffffff
    });
  }

  bounceOff() {
      this.body.touching.right ? this.setVelocityX(-this.bounceVelocity) : this.setVelocityX(this.bounceVelocity);

      setTimeout(()=> this.setVelocityY(-this.bounceVelocity), 0)
  }
  takesHit(initiator) {
    if (this.hasBeenHit) {return;}
    this.hasBeenHit = true;
    this.bounceOff();
    this.hp.decrease(initiator.damage);
    const damageAnimation = this.playDamageTween();

    this.scene.time.delayedCall(800, ()=> {this.hasBeenHit =false; damageAnimation.stop(); this.clearTint();})
/*
    this.scene.time.addEvent({
      delay: 800,
      callback: () => {this.hasBeenHit =false;},
      loop: false

    });
    */
  }


}

export default Player;
