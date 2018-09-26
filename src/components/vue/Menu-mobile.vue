<template>
  <transition name="fade">
    <div class="menu-mobile" v-if="menuMobileActivated">
      <div class="menu-mobile__center">
        <h2 class="menu-mobile__title">
          {{ $t('header_mobile_title') }}
        </h2>
        <c-link class="menu-mobile__item" :href="$t('header_cta_1_link')" :label="$t('header_cta_1')" target="_blank"></c-link>
        <c-link class="menu-mobile__item" :href="$t('header_cta_2_link')" :label="$t('header_cta_2')" target="_blank"></c-link>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import Link from '@/components/vue/Link.vue'

export default {
  name: 'Menu-Mobile',
  data () {
    return {
      sound: true
    }
  },
  components: {
    'c-link': Link
  },
  computed: {
    ...mapGetters([
      'menuMobileActivated'
    ])
  },
  methods: {
    toggleSound () {
      this.sound = !this.sound
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.menu-mobile {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:$white;
  z-index:$zMenuMobile;
  width:100vw;
  height:100vh;

  &__title {
    font-size:40px;
    font-weight:$fw-medium;
    color:$darkblue;
    margin-bottom:60px;
  }
  &__center {
    display:flex;
    text-align: center;
    margin:auto;
    flex-direction: column;
    margin-top:105px;
    max-width:60vw;
  }

  &__item {
    color:$darkblue;
    margin-bottom:25px;
    &:last-child {
      margin-bottom:0;
    }
  }
}
</style>
