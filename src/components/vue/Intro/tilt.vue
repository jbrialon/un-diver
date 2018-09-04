<template>
  <div class="tilt">
    <img ref="image" :src="src">
  </div>
</template>

<script>
import { TweenMax, Power2 } from 'gsap'

export default {
  name: 'tilt',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  methods: {
    tilt (event) {
      let posX = event.pageX
      let posY = event.pageY
      let left = window.innerWidth / 2 - posX
      let top = window.innerHeight / 2 - posY
      TweenMax.to(this.$refs.image, 0.6, {
        rotationY: left / 100,
        rotationX: top / 100,
        ease: Power2.easeOut,
        transformPerspective: 400,
        transformOrigin: 'center'
      })
    }
  },
  mounted () {
    document.addEventListener('mousemove', this.tilt)
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.tilt)
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.tilt {
  img {
    display:block;
    width:100%;
  }
}
</style>
