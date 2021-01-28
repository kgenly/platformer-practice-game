export default (anims) => {
  anims.create({
    key: 'snakey_idle',
    frames: anims.generateFrameNumbers('snakey', {start: 0, end:8}),
    frameRate: 8,
    repeat: -1
  });

  anims.create({
    key: 'snakey_hurt',
    frames: anims.generateFrameNumbers('snakey', {start: 21, end: 23}),
    frameRate: 5,
    repeat: 0
  });
}
