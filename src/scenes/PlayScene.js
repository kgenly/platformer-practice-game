import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
import initAnims from '../anims';

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super('PlayScene', config);
    this.config = config;

  }
    create() {
      const map = this.createMap();
      const layers = this.createLayers(map);
      const playerZones = this.getPlayerZones(layers.playerZones);
      const player = this.createPlayer(playerZones);

      this.plotting = false;
      this.graphics = this.add.graphics();
      this.line = new Phaser.Geom.Line();
      this.graphics.lineStyle(1, 0x00ff00);

      this.createPlayerColliders(player, {
        colliders: {
          platform_colliders: layers.platform_colliders
        }
      });

      const enemies = this.createEnemies(layers.enemySpawns, layers.platform_colliders);

      this.createEnemyColliders(enemies, {
        colliders: {
          platform_colliders: layers.platform_colliders,
          player
        }
      })

      this.createEndOfLevel(playerZones.end, player);
      this.setupFollowupCameraOn(player);
      initAnims(this.anims);



    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
    }

    onWeaponHit(entity, source) {
      entity.takesHit(source);
    }

    createPlayerColliders(player, {colliders}) {
      player.addCollider(colliders.platform_colliders);
    }

    createEnemyColliders(enemies, {colliders}) {
      enemies.addCollider(colliders.platform_colliders)
        .addCollider(colliders.player, this.onPlayerCollision)
        .addCollider(colliders.player.projectiles, this.onWeaponHit)
        .addOverlap(colliders.player.meleeWeapon, this.onWeaponHit);
    }

    createMap() {
      const map = this.make.tilemap({key: 'map'});
      map.addTilesetImage('main_lev_build_1', 'tileset-1');
      return map;
    }

    createLayers(map) {
      const tileset = map.getTileset('main_lev_build_1');
      const platform_colliders = map.createLayer('platform_colliders', tileset);
      const platforms = map.createLayer('platforms', tileset);
      const decor = map.createLayer('decoration', tileset);
      const playerZones = map.getObjectLayer('player_zones');
      const enemySpawns = map.getObjectLayer('enemy_spawns');

      platform_colliders.setCollisionByProperty({collide: true}, true);
      return {decor, platforms, platform_colliders, playerZones, enemySpawns}
    }
    createPlayer({start, end}) {
      return new Player(this, start.x, start.y);
    }

    createEnemies(spawnLayer, layer) {
      const enemies = new Enemies(this);
      const enemyTypes = enemies.getTypes();
      spawnLayer.objects.map(spawnPoint =>{
        const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
        enemy.setPlatformColliders(layer);
        enemies.add(enemy);
      });

      return enemies;
    }

    setupFollowupCameraOn(player) {
      const {height, width, mapOffset, zoomFactor} = this.config;
      this.physics.world.setBounds(0,0,width+mapOffset, height+200);
      this.cameras.main.setBounds(0,0, width + mapOffset, height).setZoom(zoomFactor);
      this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer) {
      const playerZones = playerZonesLayer.objects;
      return {
        start: playerZones.find(zone => zone.name === 'startZone'),
        end: playerZones.find(zone => zone.name === 'endZone'),
      }
    }


    createEndOfLevel(end, player) {
        const endzone = this.physics.add.sprite(end.x, end.y, 'end')
        .setSize(5, 200)
        .setAlpha(0)
        .setOrigin(.5, 1);


        const eolOverlap = this.physics.add.overlap(player, endzone, ()=> {
          console.log('Player has won!');
          eolOverlap.active = false;
        });

    }
    update() {

    }
}

export default PlayScene;
