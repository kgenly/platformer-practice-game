export default (anims) => {
  anims.create({
    key: 'birdman_idle',
    frames: anims.generateFrameNumbers('birdman', {start: 0, end:12}),
    frameRate: 8,
    repeat: -1
  });

  anims.create({
    key: 'birdman_hurt',
    frames: anims.generateFrameNumbers('birdman', {start: 25, end: 27}),
    frameRate: 5,
    repeat: 0
  });
}
