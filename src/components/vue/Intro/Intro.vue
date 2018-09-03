<template>
  <div class="intro">
    <div class="intro__container">
      <img ref="logo" src="@/assets/logo_un.png" alt="Ulysse Nardin" class="intro__logo">
      <!-- SVG markup for the mask -->
      <svg class="intro__background" width="1920" height="1080" viewBox="0 0 1920 1080" preserveAspectRatio="xMinYMin slice">
        <defs>
          <mask id="mask" x="0" y="0" width="1920" height="1080" >
            <circle ref="mask" cx="960" cy="540" r="0" style="stroke:none; fill: #ffffff"/>
          </mask>
        </defs>
        <image xlink:href="@/assets/bg.jpg" width="1920px" height="1080px" />
      </svg>
      <div ref="loader" class="intro__loader">
        <div class="circle">
          <svg class="circleFill" width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="48" stroke="#B5966B" stroke-width="3" fill="none" stroke-dashoffset="50"></circle>
          </svg>
          <svg class="circleTrack" width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="48" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="3" fill="none"></circle>
          </svg>
        </div>
        <div class="intro__loader-number">
          00%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TimelineMax, Power1 } from 'gsap'

export default {
  name: 'intro',
  data () {
    return {
      tl: new TimelineMax()
    }
  },
  methods: {
    showUI () {
      this.$store.commit('toggleUI')
    }
  },
  mounted () {
    this.tl.pause()
    this.tl.set(this.$refs.loader, {xPercent: -50, yPercent: -50, left: '50%', top: '50%'})
    this.tl.to(this.$refs.logo, 3, {autoAlpha: 1, ease: Power1.easeOut})
    this.tl.to(this.$refs.logo, 2, {autoAlpha: 0, ease: Power1.easeOut})
    this.tl.to(this.$refs.mask, 3, {attr: {r: 1100}, onComplete: this.showUI})
    this.tl.to(this.$refs.loader, 2, {autoAlpha: 1, ease: Power1.easeOut}, '-=2.5')
    this.tl.to(this.$refs.loader, 2, {xPercent: -50, yPercent: -50, left: '50%', top: '85%', ease: Power1.easeOut})
    this.tl.play()
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.intro {
  position:fixed;
  width:100vw;
  height:100vh;
  z-index:$zIntro;
  background:#031A27;
  &__container {
    position:relative;
    width:100vw;
    height:100vh;
  }
  &__logo {
    position: absolute;
    display: block;
    top:50%;
    left:50%;
    height:32px;
    transform:translate(-50%, -50%);
    opacity:0;
  }
  &__background {
    position: absolute;
    display: block;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    z-index:-1;
    image {
      mask: url(#mask);
    }
  }
  &__mask {
    position: absolute;
    width: 0;
    height: 0;
  }
  &__loader {
    position:absolute;
    opacity:0;
    &-number {
      position:absolute;
      top:50%;
      left:50%;
      font-size:30px;
      color:$white;
      font-weight:$fw-medium;
      transform:translate(-50%, -50%);
    }
    .circle {
      position: relative;
      width: 104px;
      height: 104px;
      svg {
        position:absolute;
        top:0;
      }
    }
    .circleFill {
      z-index: 1;
      stroke-dasharray: 322;
      stroke-dashoffset: 322;
      transition: all 3s;
      transform: rotate(-90deg);
    }
    .circleTrack {
      z-index: 0;
    }
  }
}
</style>
