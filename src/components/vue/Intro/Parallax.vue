<template>
  <div ref="parallax" class="parallax">
    <div class="parallax__item"></div>
    <div class="parallax__item"></div>
    <div class="parallax__item"></div>
  </div>
</template>

<script>
import { TweenMax, Power2 } from 'gsap'

export default {
  name: 'parallax',
  mounted () {
    // const items = this.$el.querySelectorAll('.parallax__item')
    TweenMax.fromTo(this.$refs.parallax, 2.5, {
      rotationY: -22,
      rotationX: -7
    }, {
      rotationY: 22,
      rotationX: 4,
      ease: Power2.easeInOut,
      repeat: -1
    })
    // this.TweenMax(items, 1, {borderColor: '#FFFFFF'}, {borderColor: '#B5966B'}, 1)
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.parallax {
  will-change: transform;
  position: relative;
  width: 40vh;
  height: 26vh;
  transform: perspective(500px);
  transform-style: preserve-3d;
  &__icon {
    position: absolute;
    transform:translate(-50%);
    bottom:0;
  }
  &__item {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 2px solid $white;
    &:nth-child(1) {
      transform: translateZ(-350px);
      border-width: 3px;
    }
    &:nth-child(2) {
      transform: translateZ(-150px);
    }
    &:nth-child(3) {
      transform: translateZ(0px);
    }
  }
}
</style>
