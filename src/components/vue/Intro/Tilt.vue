<template>
  <div class="tilt">
    <img ref="image" :src="src">
  </div>
</template>

<script>
import { TweenMax, Power2 } from 'gsap'
import Utils from '@/utils/Utils'
export default {
  name: 'tilt',
  data () {
    return {
      isMobile: Utils.isMobile()
    }
  },
  props: {
    src: {
      type: String,
      required: true
    }
  },
  methods: {
    handleOrientation (event) {
      if (event.gamma >= -35 && event.gamma <= 35) {
        TweenMax.to(this.$refs.image, 0.6, {
          rotationY: event.gamma,
          ease: Power2.easeOut,
          transformPerspective: 400,
          transformOrigin: 'center'
        })
      }
    },
    tilt (event) {
      let posX = event.clientX
      let posY = event.clientY
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
    if (!this.isMobile) {
      document.addEventListener('mousemove', this.tilt)
    } else {
      window.addEventListener('deviceorientation', this.handleOrientation, true)
    }
  },
  beforeDestroy () {
    if (!this.isMobile) {
      document.removeEventListener('mousemove', this.tilt)
    } else {
      window.removeEventListener('deviceorientation', this.handleOrientation, true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
.tilt {
  img {
    display:block;
    position:relative;
    z-index:-1;
    width:100%;
  }
}
</style>
