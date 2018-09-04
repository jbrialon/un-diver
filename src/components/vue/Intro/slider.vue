<template>
  <div class="slider">
    <div class="slider__container">
      <vueper-slides class="no-shadow" :fade="true" :bullets="false" :touchable="isMobile">
        <vueper-slide :key="1">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--text-left">
              <p class="text">
                <span class="border-bottom">Ulysse Nardin</span>, watchmaker of the oceans, is proud to announce its partnership with free diver and photographer <span class="border-bottom">Buyle</span>
              </p>
              <tilt class="image" :src="image1"></tilt>
            </div>
          </div>
        </vueper-slide>
        <vueper-slide :key="2">
          <div slot="slideContent">
            <div class="slider__slide slider__slide--text-right">
              <tilt class="image" :src="image2"></tilt>
              <p class="text">
                <span class="border-bottom">Ulysse Nardin</span> has created the Diver, a robust, functional sports watch, water resistant to <span class="border-bottom">300</span> <span class="border-bottom">meters</span>
              </p>
            </div>
          </div>
        </vueper-slide>
      </vueper-slides>
    </div>
  </div>
</template>

<script>
import Tilt from '@/components/vue/Intro/tilt.vue'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.min.css'
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
    VueperSlide
  }
}
</script>

<style lang="scss">
@import '@/scss/_vars.scss';

.slider {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  opacity:0;
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
      }
      &--next {
        right:115px;
      }
    }
  }

  &__slide {
    display:flex;
    width:60vw;
    &--text-left {
      justify-content:flex-end;
      .text {
        left:0;
        right:40%;
      }
    }
    &--text-right {
      justify-content: flex-start;
      .text {
        right:0;
        left:55%;
      }
    }
  }
  .text {
    position:absolute;
    top:30%;
    color:$white;
    font-size:40px;
    font-weight:$fw-medium;
    line-height:47px;
    text-align:left;
    z-index:1;
  }
  .image {
    width:60%;
    z-index:-1;
  }
}
</style>
