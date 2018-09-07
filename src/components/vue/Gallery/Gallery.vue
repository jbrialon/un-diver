<template>
  <transition name="fade-gallery" v-on:before-enter="beforeEnter" v-on:after-leave="afterLeave">
    <div class="gallery" v-if="showGallery">
      <div class="gallery__container">
        <vueper-slides class="no-shadow" :fade="true" :bullets="false" :touchable="isMobile" fixed-height="570px" :infinite="false" :autoplay="false">
          <vueper-slide :key="index" v-for="(slide, index) in slides">
            <div slot="slideContent">
              <img :src="slide" alt="closeup">
            </div>
          </vueper-slide>
        </vueper-slides>
        <button class="link gallery__close" @click.prevent="hideGallery()">
          {{ $t('gallery_close_button') }}
          <span class="link__top-line"></span>
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
        require('@/assets/gallery/closeup_1.jpg'),
        require('@/assets/gallery/closeup_2.jpg'),
        require('@/assets/gallery/closeup_3.jpg')
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

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.gallery {
  position:fixed;
  top:0;
  width:100vw;
  height:100vh;
  z-index:$zGallery;
  background:#031A27;
  &__container {
    position:relative;
    width:100vw;
    height:100vh;
  }
  &__close {
    position:absolute;
    bottom:16vh;
    left:50%;
    transform: translateX(-50%);
  }
}
</style>
