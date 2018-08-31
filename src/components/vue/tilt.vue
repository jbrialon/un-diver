<template>
  <div class="tilt">
    <img ref="image" src="@/assets/parralax.jpg">
  </div>
</template>

<script>
import { TweenMax, Power1 } from 'gsap'

export default {
  name: 'tilt',
  methods: {
    tilt (event) {
      let posX = event.pageX
      let posY = event.pageY
      let left = window.innerWidth / 2 - posX
      let top = window.innerHeight / 2 - posY
      TweenMax.to(this.$refs.image, 0.6, {
        rotationY: left / 100,
        rotationX: top / 100,
        ease: Power1.easeOut,
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

}
</style>
