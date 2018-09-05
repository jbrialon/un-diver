<template>
  <div class="slider">
    <div class="slider__container">
      <vueper-slides class="no-shadow" :fade="true" :bullets="false" :touchable="isMobile" fixed-height="570px" :infinite="false" :autoplay="false">
        <vueper-slide :key="1">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--left">
              <p class="text" v-html="$t('slide_1_text')"></p>
              <tilt class="image" :src="image1"></tilt>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="2">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--right">
              <tilt class="image" :src="image2"></tilt>
              <p class="text" v-html="$t('slide_2_text')"></p>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="3">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--left">
              <p class="text" v-html="$t('slide_3_text')"></p>
              <tilt class="image" :src="image3"></tilt>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="4">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--right">
              <tilt class="image" :src="image4"></tilt>
              <p class="text" v-html="$t('slide_4_text')"></p>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="5">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--left">
              <p class="text" v-html="$t('slide_5_text')"></p>
              <tilt class="image" :src="image5"></tilt>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="6">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--center">
              <Parallax class="slider__parallax"></Parallax>
              <icon-mouse class="slider__icon slider__icon--mouse"></icon-mouse>
              <icon-hand class="slider__icon slider__icon--hand"></icon-hand>
              <p class="text" v-html="$t('slide_6_text')"></p>
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
import iconHand from '@/components/icon/icon-hand.vue'

import Utils from '@/utils/Utils'

export default {
  name: 'slider',
  data () {
    return {
      isMobile: Utils.isMobile(),
      image1: require('@/assets/slider/intro_01.jpg'),
      image2: require('@/assets/slider/intro_02.jpg'),
      image3: require('@/assets/slider/intro_03.jpg'),
      image4: require('@/assets/slider/intro_04.jpg'),
      image5: require('@/assets/slider/intro_05.jpg')
    }
  },
  components: {
    Tilt,
    VueperSlides,
    VueperSlide,
    Parallax,
    iconMouse,
    iconHand
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
    top:25%;
    color:$white;
    font-size:35px;
    font-weight:$fw-medium;
    line-height:40px;
    text-align:left;
    z-index:1;
    text-shadow: 2px 1px 10px rgba(0, 0, 0, 0.7);
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
  &__icon {
    margin:20px auto 0 auto;
    &--mouse {
      @include small-only {
        display:none;
      }
    }
    &--hand {
      display:none;
      animation-name: handAnim;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      @include small-only {
        display:block;
      }
    }
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
        top:36vh;
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
  @keyframes handAnim {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(10px);
    }
  }
}
</style>
