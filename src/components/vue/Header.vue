<template>
  <header class="header" :class="{'hidden': vrModeActivated}">
    <transition name="fade">
      <button class="header__burger" :class="{'active': menuMobileActivated}" type="button" name="button" @click="toggleMenuMobile()" v-if="!vrModeActivated">
        <span class="header__burger-line"></span>
        <span class="header__burger-line"></span>
        <span class="header__burger-line"></span>
      </button>
    </transition>
    <transition name="fade">
      <c-link v-if="!vrModeActivated" :href="''" :label="'Diver collection'" class="header__link"></c-link>
    </transition>
    <a href="/" class="header__logo" v-if="!menuMobileActivated">
      <img src="@/assets/logo_un.png" alt="Ulysse Nardin">
    </a>
    <c-menu class="header__menu"></c-menu>
    <button class="header__button-vr" type="button" name="button" @click="toggleVrMode()" :class="{'active': vrModeActivated}">
      <icon-vr></icon-vr>
    </button>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Menu from '@/components/vue/Menu.vue'
import Link from '@/components/vue/Link.vue'
import iconVr from '@/components/icon/icon-vr.vue'

export default {
  name: 'Header',
  components: {
    'c-menu': Menu,
    'c-link': Link,
    'icon-vr': iconVr
  },
  methods: {
    toggleMenuMobile () {
      this.$store.commit('toggleMenuMobile')
      if (this.menuMobileActivated) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    toggleVrMode () {
      this.$store.commit('toggleVrMode')
    }
  },
  computed: {
    ...mapGetters([
      'vrModeActivated',
      'menuMobileActivated'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.header {
  display: flex;
  align-items: center;
  height:40px;
  position: fixed;
  z-index: $zHeader;
  top: 2vw;
  left:4vw;
  right: 4vw;
  @include small-only {
    top: 8vw;
    left:8vw;
    right:8vw;
  }

  &__burger {
    position:relative;
    display:none;
    width:27px;
    height:22px;
    @include small-only {
      display:block;
    }
    &.active {
      .header__burger-line {
        background:$darkblue;
        &:nth-child(1) {
          transform:rotate(45deg);
        }
        &:nth-child(2) {
          opacity:0;
        }
        &:nth-child(3) {
          transform:rotate(-45deg);
        }
      }
    }
    &-line {
      position:absolute;
      display:block;
      background:$white;
      border-radius:4px;
      width:27px;
      height:2px;
      transform-origin: left;
      &:nth-child(1) {
        transition: transform 200ms ease-out, background 300ms ease-out;;
        top:0;
      }
      &:nth-child(2) {
        transition: opacity 100ms ease-out, background 300ms ease-out;;
        top:10px;
        opacity:1;
      }
      &:nth-child(3) {
        transition: transform 200ms ease-out, background 300ms ease-out;;
        bottom:0;
      }
    }
  }
  &__button-vr {
    display:none;
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    right:0;
    opacity: 0.4;
    @include small-only {
      display:block;
    }
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
  &__logo {
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    margin:auto;
  }
  &__link {
    @include small-only {
      display:none;
    }
  }
  &__menu {
    margin-left:auto;
  }
}
</style>
