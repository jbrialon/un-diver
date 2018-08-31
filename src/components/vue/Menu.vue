<template>
  <nav class="menu">
    <transition name="fade">
      <c-link v-if="!vrModeActivated" class="menu__item hide-for-mobile" :href="''" :label="'Find a boutique'"></c-link>
    </transition>
    <transition name="fade">
      <button v-if="displayButton" class="menu__item menu__item--sound" :class="{'disabled': !sound}" type="button" name="sound" @click="toggleSound()">
        SOUND
      </button>
    </transition>
    <transition name="fade">
      <button v-if="displayButton" class="menu__item menu__item--lang" type="button">
        FR
      </button>
    </transition>
    <button class="menu__item menu__item--vr hide-for-mobile" type="button" @click="toggleVrMode()" :class="{'active': vrModeActivated}">
      <icon-vr></icon-vr>
    </button>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import Link from '@/components/vue/Link.vue'
import iconVr from '@/components/icon/icon-vr.vue'

import Utils from '@/utils/Utils'

export default {
  name: 'Menu',
  data () {
    return {
      sound: true,
      isMobile: Utils.isMobile()
    }
  },
  components: {
    'c-link': Link,
    'icon-vr': iconVr
  },
  computed: {
    ...mapGetters([
      'vrModeActivated',
      'menuMobileActivated'
    ]),
    displayButton () {
      return ((this.menuMobileActivated && this.isMobile) || (!this.menuMobileActivated && !this.isMobile)) && !this.vrModeActivated
    }
  },
  methods: {
    toggleSound () {
      this.sound = !this.sound
    },
    toggleVrMode () {
      this.$store.commit('toggleVrMode')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.menu {
  display:flex;

  &__item {
    color:$white;
    margin:0 20px;
    font-size:$fs-buttons;
    letter-spacing: $ls-buttons;
    font-weight:$fw-bold;
    text-transform:uppercase;
    @include small-only {
      color:$darkblue;
    }
    &:first-child {
      margin-left:0;
    }
    &--vr {
      opacity: .4;
      &.active {
        opacity: 1;
      }
      svg {
        width: 24px;
        height: 24px;
        path {
          fill: $white;
        }
      }
    }

    &--sound {
      position:relative;
      &.disabled:after {
        width:115%;
      }
      &:after {
        position:absolute;
        content:'';
        left:-5px;
        width:0%;
        height:1px;
        background: $white;
        top:50%;
        transition: width 300ms ease-out;
        @include small-only {
          background:$darkblue;
        }
      }
    }
  }
}
</style>
