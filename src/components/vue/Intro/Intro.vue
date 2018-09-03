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
    </div>
  </div>
</template>

<script>
import { TimelineMax, Power1 } from 'gsap'

export default {
  name: 'intro',
  data () {
    return {
      tl: new TimelineMax({delay: 3, onComplete: this.restart})
    }
  },
  methods: {
    restart () {
    }
  },
  mounted () {
    this.tl.pause()
    this.tl.to(this.$refs.logo, 3, {autoAlpha: 1, ease: Power1.easeOut})
    this.tl.to(this.$refs.logo, 2, {autoAlpha: 0, ease: Power1.easeOut})
    this.tl.to(this.$refs.mask, 3, {attr: {r: 1200}, ease: Power1.easeOut})
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
}
</style>
