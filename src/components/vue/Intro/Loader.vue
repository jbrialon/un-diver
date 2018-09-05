<template>
  <div class="loader">
    <div class="circle">
      <svg class="circleGradient" width="236" height="236" viewBox="0 0 236 236">
          <defs>
            <radialGradient id="gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stop-color="rgb(181, 150, 107)" stop-opacity="0.2" />
              <stop offset="80%" stop-color="rgb(181, 150, 107)" stop-opacity="0" />
              <stop offset="100%" stop-color="rgb(181, 150, 107)" stop-opacity="0" />
            </radialGradient>
          </defs>
        <circle ref="gradient" cx="118" cy="118" r="116" fill="url(#gradient)" fill-opacity="0"></circle>
      </svg>

      <svg class="circleBackground" width="236" height="236" viewBox="0 0 236 236">
        <circle ref="background" cx="118" cy="118" r="0" style="stroke:none; fill: #B5966B"></circle>
      </svg>

      <svg class="circleBackgroundBorder1" width="236" height="236" viewBox="0 0 236 236">
        <circle ref="borderOne" cx="118" cy="118" r="48" fill="none" stroke="#B5966B" stroke-width="1" stroke-opacity="0.5"></circle>
      </svg>
      <svg class="circleBackgroundBorder2" width="236" height="236" viewBox="0 0 236 236">
        <circle ref="borderTwo" cx="118" cy="118" r="48" fill="none" stroke="#B5966B" stroke-width="1" stroke-opacity="0.2"></circle>
      </svg>

      <svg class="circleFill" width="236" height="236" viewBox="0 0 236 236" :style="strokeDashoffset">
        <circle cx="118" cy="118" r="48" stroke="#B5966B" stroke-width="3" fill="none"></circle>
      </svg>
      <svg class="circleTrack" width="236" height="236" viewBox="0 0 236 236">
        <circle cx="118" cy="118" r="48" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="3" fill="none"></circle>
      </svg>
    </div>
    <div ref="number" class="loader__number">
      {{ padPercent }}%
    </div>
    <div ref="text" class="loader__text">
      Start diving
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TweenMax, TimelineMax, Power2 } from 'gsap'
import Utils from '@/utils/Utils'

export default {
  name: 'loader',
  data () {
    return {
      test: true,
      tl: new TimelineMax(),
      tlRepeat: new TimelineMax({repeat: -1})
    }
  },
  methods: {
    animate () {
      TweenMax.to(this.$refs.number, 1.5, {autoAlpha: 0, ease: Power2.easeOut})
      TweenMax.to(this.$refs.text, 1.5, {autoAlpha: 1, ease: Power2.easeOut})

      this.tl.to(this.$refs.background, 1, {attr: {r: 48}, ease: Power2.easeOut}, 2)
      this.tl.to(this.$refs.gradient, 1, {attr: {'fill-opacity': 1}, ease: Power2.easeOut}, '-=1')
      this.tl.to(this.$refs.borderOne, 1.5, {attr: {r: 74, 'stroke-opacity': 0.4}, ease: Power2.easeOut}, '-=0.5')
      this.tl.to(this.$refs.borderTwo, 1.5, {attr: {r: 116, 'stroke-opacity': 0.2}, ease: Power2.easeOut}, '-=0.5')
    },
    repeat () {
      this.tlRepeat.fromTo(this.$refs.borderOne, 1.5, {attr: {r: 48, 'stroke-opacity': 0.4}, ease: Power2.easeOut}, {attr: {r: 74, 'stroke-opacity': 0}, ease: Power2.easeOut})
      this.tlRepeat.fromTo(this.$refs.borderTwo, 2, {attr: {r: 48, 'stroke-opacity': 0.4}, ease: Power2.easeOut}, {attr: {r: 116, 'stroke-opacity': 0}, ease: Power2.easeOut}, '-=1')
    }
  },
  computed: {
    ...mapGetters([
      'loadingPercent',
      'uiActivated'
    ]),
    animateLoader () {
      return this.loadingPercent === 1 && this.uiActivated
    },
    strokeDashoffset () {
      let circumference = 2 * Math.PI * 48
      let offset = circumference * this.loadingPercent
      return {
        strokeDasharray: `${offset}, ${circumference}`
      }
    },
    padPercent () {
      return Utils.pad(this.loadingPercent * 100, 2)
    }
  },
  watch: {
    animateLoader () {
      if (this.animateLoader) {
        this.animate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.loader {
  position:absolute;
  opacity:0;
  &__number {
    position:absolute;
    top:50%;
    left:50%;
    font-size:30px;
    color:$white;
    font-weight:$fw-medium;
    transform:translate(-50%, -50%);
  }
  &__button {
    display:block;
    width: 104px;
    height: 104px;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    border-radius:50%;
    cursor:pointer;
    z-index:2;
  }
  &__text {
    position:absolute;
    opacity:0;
    top:48%;
    left:50%;
    font-size:20px;
    line-height:24px;
    width:96px;
    text-align:center;
    color:$white;
    font-weight:$fw-medium;
    transform:translate(-50%, -50%);

  }
  .circle {
    position: relative;
    width: 236px;
    height: 236px;
    svg {
      position:absolute;
      top:0;
    }
    svg.circleGradient {
      z-index:-1;
    }
    svg.circleFill {
      z-index: 1;
      transform: rotate(-90deg);
      $pi: 22/7;
      $radius: 48;
      $circumference: 2 * $pi * $radius;
      stroke-dasharray: calc(#{$circumference} * 0 / 100), #{$circumference};
      transition:all 2s ease-out;
    }
    svg.circleTrack {
      z-index: 0;
    }
  }
}
</style>
