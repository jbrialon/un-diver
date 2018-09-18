<template>
  <transition name="fade-gallery" v-on:before-enter="beforeEnter" v-on:after-leave="afterLeave">
    <div class="gallery" v-if="showGallery">
      <div class="gallery__container">
        <vueper-slides
          class="no-shadow"
          :fade="true"
          :bullets="false"
          :touchable="isMobile"
          fixed-height="570px"
          :infinite="false"
          :autoplay="false"
          :arrowsOutside="true"
        >
          <vueper-slide :key="index" v-for="(slide, index) in slides">
            <div slot="slideContent">
              <img class="gallery__image" :src="slide" alt="closeup">
            </div>
          </vueper-slide>
        </vueper-slides>
        <button class="gallery__close" @click.prevent="hideGallery()">
          +
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.min.css'

import Utils from '@/utils/Utils'

export default {
  name: 'gallery',
  data () {
    return {
      isMobile: Utils.isMobile(),
      slides: [
        'images/gallery/closeup_1.jpg',
        'images/gallery/closeup_2.jpg',
        'images/gallery/closeup_3.jpg'
      ]
    }
  },
  components: {
    VueperSlides,
    VueperSlide
  },
  computed: {
    ...mapGetters([
      'showGallery'
    ])
  },
  methods: {
    beforeEnter () {
      document.body.style.overflow = 'hidden'
    },
    afterLeave () {
      document.body.style.overflow = ''
    },
    hideGallery () {
      this.$store.commit('showGallery', false)
    }
  }
}
</script>

<style lang="scss">
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.gallery {
  position:fixed;
  top:0;
  width:100vw;
  height:100vh;
  z-index:$zGallery;
  background:#031A27;
  .vueperslides .vueperslides__arrow--next {
    right:-80px;
    @include small-only {
      top: 50%;
      right:15px;
      transform: translateY(-50%);
    }
  }
   .vueperslides .vueperslides__arrow--prev {
    left:-80px;
    @include small-only {
      top: 50%;
      left:15px;
      transform: translateY(-50%);
    }
  }
  &__container {
    position:relative;
    width:100vw;
    height:100vh;
    @include medium {
      width:60vw;
      margin:auto;
    }
  }
  &__image {
    @include small-only {
      width:80vw;
    }
  }
  &__close {
    position:absolute;
    bottom:8vh;
    left:50%;
    transform: translateX(-50%);
    text-decoration: none;
    font-weight: $fw-light;
    color: $white;
    font-size: 0;
    z-index:1;
    opacity:0.7;
    width:33px;
    height:33px;
    transition:opacity 0.3s ease-in-out;
    background:$gold;
    border-radius:50%;
    @include small-only {
      bottom:16vh;
    }
    &::before {
      content: '+';
      display: block;
      position: absolute;
      z-index: -1;
      font-size:25px;
      width:33px;
      height:33px;
      left: 46%;
      top: 54%;
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
      transform-origin:center;
    }

    &:hover {
      opacity:1;
    }
  }
}
</style>
