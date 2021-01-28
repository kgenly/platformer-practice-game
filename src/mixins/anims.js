export default {
  isPlayingAnim(animsKey) {
    return this.anims.isPlaying && this.anims.currentAnim.key === animsKey;
  }
}
