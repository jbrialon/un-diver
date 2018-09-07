<template>
  <transition name="fade-gallery">
    <div class="gallery" v-if="showGallery">
      <div class="gallery__container">
        <button class="link gallery__close" @click.prevent="hideGallery()">
          back to experience
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

import Link from '@/components/vue/Link.vue'

export default {
  name: 'gallery',
  components: {
    VueperSlides,
    VueperSlide,
    'c-link': Link
  },
  computed: {
    ...mapGetters([
      'showGallery'
    ])
  },
  methods: {
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
    bottom:8vh;
    left:50%;
    transform: translateX(-50%);
  }
}
</style>
