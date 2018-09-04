<template>
  <div class="slider">
    <div class="slider__container">
      <vueper-slides class="no-shadow" :fade="true" :bullets="false" :touchable="isMobile" fixed-height="570px">
        <vueper-slide :key="1">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--left">
              <p class="text">
                <span class="border-bottom">Ulysse Nardin</span>,
                watchmaker of the oceans, is proud to announce its partnership with free diver and photographer
                <span class="border-bottom">Buyle</span>
              </p>
              <tilt class="image" :src="image1"></tilt>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="2">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--right">
              <tilt class="image" :src="image2"></tilt>
              <p class="text">
                <span class="border-bottom">Ulysse Nardin</span>
                has created the Diver, a robust, functional sports watch, water resistant to
                <span class="border-bottom">300</span> <span class="border-bottom">meters</span>
              </p>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="3">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--center">
              <Parallax class="slider__parallax"></Parallax>
              <icon-mouse class="slider__mouse-icon"></icon-mouse>
              <p class="text">
                To dive, use scroll & rotation to explore
              </p>
            </div>
          </div>
        </vueper-slide>
      </vueper-slides>
    </div>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.min.css'

import Tilt from '@/components/vue/Intro/Tilt.vue'
import Parallax from '@/components/vue/Intro/Parallax.vue'
import iconMouse from '@/components/icon/icon-mouse.vue'

import Utils from '@/utils/Utils'

export default {
  name: 'slider',
  data () {
    return {
      isMobile: Utils.isMobile(),
      image1: require('@/assets/slider/intro_1.jpg'),
      image2: require('@/assets/slider/intro_2.jpg')
    }
  },
  components: {
    Tilt,
    VueperSlides,
    VueperSlide,
    Parallax,
    iconMouse
  }
}
</script>

<style lang="scss">
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.slider {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  opacity:0;

  .text {
    position:absolute;
    top:30%;
    color:$white;
    font-size:40px;
    font-weight:$fw-medium;
    line-height:47px;
    text-align:left;
    z-index:1;
    @include small-only {
      position:relative;
      top:auto;
      font-size: 24px;
      margin-top:20px;
      line-height:27px;
      text-align:center;
    }
  }
  .image {
    width:60%;
    z-index:-1;
    @include small-only {
      width:100%;
    }
  }
  &__parallax {
    margin:auto;
  }
  &__mouse-icon {
    margin:20px auto 0 auto;
  }
  &__container {
    position:relative;
    width:100%;
    height:100%;
    .vueperslides {
      top:50%;
      transform:translateY(-50%)
    }
    .vueperslides__arrow {
      background:$gold;
      border-radius:50%;
      width:33px;
      height:33px;
      @include small-only {
        top:32vh;
      }
      svg {
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        width:15px;
        height:15px;
      }
      &--prev {
        left:115px;
        @include small-only {
          left:15px;
        }
      }
      &--next {
        right:115px;
        @include small-only {
          right:15px;
        }
      }
    }
  }

  &__slide {
    display:flex;
    width:60vw;
    @include small-only {
      width:80vw;
    }
    &--left {
      justify-content:flex-end;
      @include small-only {
        justify-content: flex-start;
        flex-direction: column-reverse;
      }
      .text {
        left:0;
        right:40%;
        @include small-only {
          right:auto;
          left:auto;
        }
      }
    }
    &--right {
      justify-content: flex-start;
      @include small-only {
        justify-content: flex-start;
        flex-direction: column;
      }
      .text {
        right:0;
        left:55%;
        @include small-only {
          right:auto;
          left:auto;
        }
      }
    }
    &--center {
      justify-content: center;
      flex-direction: column;
      .text {
        margin: 20px auto;
        position:relative;
        top:auto;
        text-align:center;
        max-width:625px;
      }
    }
  }
}
</style>
