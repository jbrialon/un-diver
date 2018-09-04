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
    TweenMax.fromTo(this.$refs.parallax, 2.5, {
      rotationY: -15,
      rotationX: -5
    }, {
      rotationY: 15,
      rotationX: 5,
      yoyo: true,
      yoyoEase: true,
      ease: Power2.easeInOut,
      repeat: -1
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.parallax {
  will-change: transform;
  position: relative;
  width: 300px;
  height: 200px;
  transform: perspective(500px);
  transform-style: preserve-3d;
  &__item {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 2px solid $white;
    &:nth-child(1) {
      transform: translateZ(-300px);
    }
    &:nth-child(2) {
      transform: translateZ(-100px);
    }
  }
}
</style>
