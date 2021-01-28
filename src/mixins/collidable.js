import Phaser from 'phaser';
export default {
  addOverlap(thingToHit, callback, context) {
    this.scene.physics.add.overlap(this, thingToHit, callback, null, context || this);
    return this;
  },
  addCollider(thingToHit, callback, context) {
    this.scene.physics.add.collider(this, thingToHit, callback, null, context || this);
    return this;
  },

  bodyPositionDifferenceX: 0,
  prevRay: null,
  prevHasHit: null,

  raycast(body, layer, {raylength = 30, precision= 0, steepness = 1}) {
    const {x,y,width,halfHeight} = body;


    this.bodyPositionDifferenceX += body.x - body.prev.x;

    if ((Math.abs(this.bodyPositionDifferenceX) <= precision) && this.prevHasHit !== null) {
      return {
        ray: this.prevRay,
        hasHit: this.prevHasHit
      }
    }

    const line = new Phaser.Geom.Line();
    let hasHit = false;

    switch(body.facing) {
      case Phaser.Physics.Arcade.FACING_RIGHT: {
        console.log('facing right');
        line.x1 = x+width;
        line.y1 = y + halfHeight;
        line.x2 = line.x1+raylength * steepness;
        line.y2 = line.y1 + raylength;
        break;
      }
      case Phaser.Physics.Arcade.FACING_LEFT: {
        console.log('facing left');
        line.x1 = x;
        line.y1 = y + halfHeight;
        line.x2 = line.x1-raylength* steepness;
        line.y2 = line.y1 + raylength;
        break;
      }
    }

    const tileHits = layer.getTilesWithinShape(line);

    if (tileHits.length > 0) {
      //Some will return true if at least one element satisfy the condition hit.index !== -1
        hasHit = this.prevHasHit = tileHits.some(tile => tile.index !== -1);
    }

    this.prevRay = line;
    this.bodyPositionDifferenceX = 0;
    return {ray: line, hasHit};
  }

}
