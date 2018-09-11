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
          {{ $t('gallery_close_button') }}
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
  }
   .vueperslides .vueperslides__arrow--prev {
    left:-80px;
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
    bottom:16vh;
  }
}
</style>
