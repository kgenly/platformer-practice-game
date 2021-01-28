import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import anims from '../mixins/anims';


class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
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
    this.gravity =500;
    this.timeFromLastTurn = 0;
    this.rayGraphics = this.scene.add.graphics({lineStyle: {width: 2, color: 0xaa00aa }});
    this.velocity = 50;
    this.platformCollidersLayer = null;
    this.maxPatrolDistance = 250;
    this.currentPatrolDistance =0;
    this.health = 80;
    this.damage = 20;
    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

    this.setGravityY(this.gravity);
    this.setOrigin(0.5,1);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);

    this.setVelocityX(this.velocity);

  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

  }

  update(time, delta) {
    if (this.getBounds().bottom > 600) {
      this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.update, this);
      this.setActive(false);
      this.rayGraphics.clear();
      this.destroy();
      return;
    }

      this.patrol(time);
  }

  patrol(time) {
    if (!this.body || !this.body.onFloor()) { return;}
    this.currentPatrolDistance += Math.abs(this.body.deltaX());
    const {ray, hasHit} = this.raycast(this.body, this.platformCollidersLayer, {raylength: 30, precision: 2, steepness: 0.2});


    if ((!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
         this.timeFromLastTurn + 100 < time) {
      this.setFlipX(!this.flipX);
      this.setVelocityX(this.velocity = -this.velocity);
      this.timeFromLastTurn = time;
      this.currentPatrolDistance = 0;
    }
    if (this.config.debug && ray) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
  }

  setPlatformColliders(platform_colliders) {
    this.platformCollidersLayer = platform_colliders;
  }

  takesHit(source) {
    this.health -= source.damage;
    source.deliveredHit(this);
    if (this.health <= 0) {
      this.terminate();
    }
  }

  terminate() {
    this.setTint(0xff0000);
    this.setVelocityX(0);
    this.setVelocityY(-300);
    this.body.checkCollision.none=true;
    this.setCollideWorldBounds(false);
  }




}

export default Enemy;
