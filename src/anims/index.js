export default (anims) => {
  anims.create({
    key: 'explosion',
    frames: anims.generateFrameNumbers('explosion', {start: 0, end:4}),
    frameRate: 10,
    repeat: 0
  });

  anims.create({
    key: 'sword_default-swing',
    frames: anims.generateFrameNumbers('sword_default', {start: 0, end:2}),
    frameRate: 20,
    repeat: 0
  });
}
