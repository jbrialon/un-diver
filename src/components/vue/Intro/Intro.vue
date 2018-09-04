<template>
  <div class="intro">
    <div class="intro__container">
      <!-- LOGO -->
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
      <!-- Intro Paragraph -->
      <div ref="paragraph" class="intro__paragraph">
        <h2 class="border-bottom">
          Diver Experience
        </h2>
        <p>
          Ulysse Nardin, watchmaker of the oceans, is proud to announce its partnership with free diver and photographer Buyle
        </p>
      </div>
      <c-slider ref="slider"></c-slider>
      <!-- Loaded -->
      <c-loader ref="loader"></c-loader>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/vue/Intro/Loader.vue'
import Slider from '@/components/vue/Intro/Slider.vue'
import { TimelineMax, Power1, Power2 } from 'gsap'

export default {
  name: 'intro',
  data () {
    return {
      tl: new TimelineMax()
    }
  },
  components: {
    'c-loader': Loader,
    'c-slider': Slider
  },
  methods: {
    showUI () {
      this.$store.commit('toggleUI')
    }
  },
  mounted () {
    this.tl.pause()
    this.tl.set(this.$refs.loader.$el, {xPercent: -50, yPercent: -50, left: '50%', top: '50%'})
    this.tl.to(this.$refs.logo, 3, {autoAlpha: 1, ease: Power1.easeOut})
    this.tl.to(this.$refs.logo, 2, {autoAlpha: 0, ease: Power1.easeOut})
    this.tl.to(this.$refs.mask, 1.7, {attr: {r: 1100}, onComplete: this.showUI, ease: Power2.easeIn})
    this.tl.to(this.$refs.loader.$el, 2, {autoAlpha: 1, ease: Power1.easeOut}, '-=2.5')
    this.tl.to(this.$refs.loader.$el, 1.5, {xPercent: -50, yPercent: -50, left: '50%', top: '85%', ease: Power2.easeInOut})
    this.tl.to(this.$refs.paragraph, 2, {autoAlpha: 1, ease: Power1.easeOut}, '-=1')
    this.tl.to(this.$refs.paragraph, 1, {autoAlpha: 0, ease: Power1.easeOut})
    this.tl.to(this.$refs.slider.$el, 2, {autoAlpha: 1, ease: Power1.easeOut}, '-=1')
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
  &__paragraph {
    position:absolute;
    text-align:center;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    color:$white;
    max-width:530px;
    opacity:0;
    h2 {
      font-size:70px;
      font-weight:$fw-medium;
      margin-bottom:40px;
    }
    p {
      font-size:20px;
      line-height:24px;
    }
  }
}
</style>
