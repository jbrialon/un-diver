<template>
  <div class="intro" v-if="show">
    <div class="intro__container">
      <!-- LOGO -->
      <img ref="logo" src="@/assets/logo_un.png" alt="Ulysse Nardin" class="intro__logo">
      <!-- SVG markup for the mask -->
      <svg class="intro__background" width="2132" height="1200" viewBox="0 0 2132 1200" preserveAspectRatio="xMinYMin slice">
        <defs>
          <mask id="mask" x="0" y="0" width="2132" height="1200" >
            <circle ref="mask1" cx="1066" cy="600" r="0" fill="white" stroke="none"/>
            <circle ref="mask2" cx="1066" cy="600" r="0" fill="black" stroke="none"/>
          </mask>
        </defs>
        <image xlink:href="@/assets/bg.jpg" width="2132px" height="1200px" />
      </svg>
      <!-- Intro Paragraph -->
      <div ref="paragraph" class="intro__paragraph">
        <h2 class="border-bottom">
          {{ $t("intro_title") }}
        </h2>
        <p v-html="$t('intro_paragraph')"></p>
      </div>
      <c-slider ref="slider"></c-slider>
      <!-- Loader -->
      <c-loader ref="loader" class="intro__loader" @click.native="next()"></c-loader>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loader from '@/components/vue/Intro/Loader.vue'
import Slider from '@/components/vue/Intro/Slider.vue'
import { TweenMax, TimelineMax, Power1, Power2 } from 'gsap'

export default {
  name: 'intro',
  data () {
    return {
      show: true,
      tl: new TimelineMax(),
      tlLeave: new TimelineMax()
    }
  },
  components: {
    'c-loader': Loader,
    'c-slider': Slider
  },
  computed: {
    ...mapGetters([
      'loadingPercent',
      'uiActivated'
    ])
  },
  methods: {
    showUI () {
      this.$store.commit('toggleUI')
    },
    next () {
      if (this.loadingPercent === 1 && this.uiActivated && this.$refs.loader.fakePercent === 100) {
        TweenMax.set(this.$el, { background: 'transparent' })
        TweenMax.to(this.$refs.paragraph, 1, { autoAlpha: 0, ease: Power1.easeOut })
        this.tlLeave.to(this.$refs.slider.$el, 2, { autoAlpha: 0, ease: Power1.easeOut })
        this.tlLeave.to(this.$refs.loader.$el, 1.5, { xPercent: -50, yPercent: -50, left: '50%', top: '50%', ease: Power2.easeInOut }, '-=2')
        this.tlLeave.to(this.$refs.mask2, 2.3, { attr: { r: 1150 }, onStart: this.hideLoader, onComplete: this.leaveIntro, ease: Power2.easeOut })
        this.$store.commit('initDiving')
      }
    },
    startCount () {
      this.$refs.loader.startCount()
    },
    hideLoader () {
      this.$refs.loader.hide()
    },
    leaveIntro () {
      document.body.style.overflow = ''
      this.show = false
    }
  },
  mounted () {
    document.body.style.overflow = 'hidden'
    this.tl.pause()
    this.tl.set(this.$refs.loader.$el, { xPercent: -50, yPercent: -50, left: '50%', top: '50%' })
    this.tl.to(this.$refs.logo, 3, { autoAlpha: 1, ease: Power1.easeOut })
    this.tl.to(this.$refs.logo, 2, { autoAlpha: 0, ease: Power1.easeOut })
    this.tl.to(this.$refs.mask1, 1.7, { attr: { r: 1150 }, onComplete: this.showUI, ease: Power2.easeIn })
    this.tl.to(this.$refs.loader.$el, 2, { autoAlpha: 1, ease: Power1.easeOut }, '-=1.7')
    this.tl.to(this.$refs.loader.$el, 1.5, { xPercent: -50, yPercent: -50, left: '50%', top: '85%', onComplete: this.startCount, ease: Power2.easeInOut })
    this.tl.to(this.$refs.paragraph, 2, { autoAlpha: 1, ease: Power1.easeOut }, '-=1')
    this.tl.to(this.$refs.paragraph, 1, { autoAlpha: 0, ease: Power1.easeOut }, 15)
    this.tl.to(this.$refs.slider.$el, 2, { autoAlpha: 1, ease: Power1.easeOut }, '-=1')
    this.tl.play()
  },
  beforeDestroy () {
    this.tl.kill()
    this.tlLeave.kill()
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.intro {
  position:fixed;
  width:100vw;
  height:100vh;
  z-index:$zIntro;
  background:#031A27;
  /* CSS specific to iOS devices */
  @supports (-webkit-overflow-scrolling: touch) {
    height:calc(100vh - 74px);
  }
  &__container {
    position:relative;
    width:100vw;
    height:100vh;
    /* CSS specific to iOS devices */
    @supports (-webkit-overflow-scrolling: touch) {
      height:calc(100vh - 74px);
    }
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
    @include small-only {
      width:90vw;
    }
    h2 {
      font-size:70px;
      font-weight:$fw-medium;
      margin-bottom:40px;
      display:inline-block;
      line-height:82px;
      @include small-only {
        display:inline-block;
        font-size:40px;
        margin-bottom:20px;
        line-height:47px;
      }
    }
    p {
      font-size:20px;
      line-height:28px;
      letter-spacing:1px;
    }
  }
  &__loader {
    user-select: none;
  }
}
</style>
