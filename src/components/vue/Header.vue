<template>
  <transition name="fade">
    <header v-if="uiActivated" class="header" :class="{'hidden': vrModeActivated}">
      <transition name="fade">
        <button class="header__burger" :class="{'active': menuMobileActivated}" type="button" name="button" @click="toggleMenuMobile()" v-if="!vrModeActivated">
          <span class="header__burger-line"></span>
          <span class="header__burger-line"></span>
          <span class="header__burger-line"></span>
        </button>
      </transition>
      <transition name="fade">
        <a class="header__link" :href="$t('header_cta_1_link')" v-html="$t('header_cta_1')" target="_blank"></a>
      </transition>
      <a href="/" class="header__logo" v-if="!menuMobileActivated">
        <img src="images/logo_un.png" alt="Ulysse Nardin">
      </a>
      <c-menu class="header__menu"></c-menu>
      <transition name="fade">
        <button
          v-if="displayVr"
          class="header__button-vr"
          type="button"
          name="button"
          @click="toggleVrMode()"
          :class="{'active': vrModeActivated}"
        >
          <icon-vr></icon-vr>
        </button>
      </transition>
    </header>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import Menu from '@/components/vue/Menu.vue'
import iconVr from '@/components/icon/icon-vr.vue'
import Utils from '@/utils/Utils'

export default {
  name: 'Header',
  components: {
    'c-menu': Menu,
    'icon-vr': iconVr
  },
  methods: {
    reload () {
      window.location.reload()
    },
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
      'menuMobileActivated',
      'uiActivated',
      'initDiving'
    ]),
    displayVr () {
      return Utils.isMobile() && this.initDiving
    }
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
    width:28px;
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
      width:28px;
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
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    right:0;
    opacity: 0.4;
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
    img {
      height:32px;
    }
  }
  &__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 150px;
    height: 40px;
    padding: 0 10px;
    outline: none;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
    line-height:12px;
    font-size: $fs-buttons;
    letter-spacing: $ls-buttons;
    font-weight:$fw-bold;
    background-color: transparent;
    color:$white;
    text-decoration:none;
    border: none;
    color: $gold;
    transition: color 300ms ease;
    &:hover {
      color:$white;
    }
    @include small-only {
      display:none;
    }
  }
  &__menu {
    margin-left:auto;
  }
}
</style>
