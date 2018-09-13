<template>
  <nav class="menu">
    <transition name="fade">
      <c-link v-if="!vrModeActivated" class="menu__item hide-for-mobile" :href="$t('header_cta_2_link')" :label="$t('header_cta_2')"></c-link>
    </transition>
    <transition name="fade">
      <button v-if="displayButton" class="menu__item menu__item--sound" :class="{'disabled': !sound}" type="button" name="sound" @click="toggleSound()">
        {{ $t("header_cta_sound") }}
      </button>
    </transition>
    <transition name="fade">
      <button v-if="displayButton" class="menu__item menu__item--lang" type="button" @click="dropIt()">
        {{ currentLocale }}
        <transition name="slide">
          <ul v-if="isDroppped">
            <li v-for="(locale, index) in localesList" :key="index">
              <a :href="getUrl(locale)" :hreflang="locale">
                {{ locale }}
              </a>
            </li>
          </ul>
        </transition>
      </button>
    </transition>
    <button
      class="menu__item menu__item--vr hide-for-mobile"
      type="button" @click="toggleVrMode()"
      :class="{'active': vrModeActivated, 'show': initDiving}"
    >
      <icon-vr></icon-vr>
    </button>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import Link from '@/components/vue/Link.vue'
import iconVr from '@/components/icon/icon-vr.vue'

import Utils from '@/utils/Utils'
import { localesList } from '@/i18n'
// import GuiManager from '@/utils/GuiManager'

export default {
  name: 'Menu',
  data () {
    return {
      isDroppped: false,
      sound: true,
      isMobile: Utils.isMobile(),
      localesList: localesList,
      currentLocale: this.$i18n.locale,
      ambianceAudio: new Audio('audio/ambiance.mp3'),
      startdiveAudio: new Audio('audio/startdive.mp3')
    }
  },
  components: {
    'c-link': Link,
    'icon-vr': iconVr
  },
  computed: {
    ...mapGetters([
      'vrModeActivated',
      'menuMobileActivated',
      'initDiving'
    ]),
    displayButton () {
      return ((this.menuMobileActivated && this.isMobile) || (!this.menuMobileActivated && !this.isMobile)) && !this.vrModeActivated
    }
  },
  watch: {
    initDiving () {
      if (this.initDiving) {
        setTimeout(() => {
          this.ambianceAudio.play()
          this.startdiveAudio.play()
        }, 2000)
      }
    }
  },
  methods: {
    dropIt () {
      this.isDroppped = !this.isDroppped
    },
    getUrl (locale) {
      return `/${locale}`
    },
    toggleSound () {
      this.sound = !this.sound
      if (this.sound) {
        this.ambianceAudio.play()
      } else {
        this.ambianceAudio.pause()
      }
    },
    toggleVrMode () {
      if (this.initDiving) {
        this.$store.commit('toggleVrMode')
      }
    }
  },
  mounted () {
    this.ambianceAudio.addEventListener('ended',() => {
      this.ambianceAudio.currentTime = 0
      this.ambianceAudio.play()
    }, false)
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
      opacity: 0;
      &.show {
        opacity: 0.4;
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
    &--lang {
      position:relative;
      padding-right:15px;
      transition:opacity 300ms ease-out;
      &:hover {
        opacity:0.8;
      }
      &:after {
        position:absolute;
        content:'';
        right:0;
        top:18px;
        width:8px;
        height:5px;
        background:url('../../assets/arrow-white.png');
        @include small-only {
          top:4px;
          background:url('../../assets/arrow-blue.png');
        }
      }
      ul {
        position:absolute;
        background:$darkblue;
        margin-top:5px;
        left:-10px;
        height:0;
        overflow:hidden;
        height:105px;
        transition:height 300ms ease-out;
        li {
          margin-bottom:2px;
          padding-left:10px;
          padding-right:8px;
          &:first-child {
            margin-top:10px;
          }
          &:last-child {
            margin-bottom:10px;
          }
          a {
            color:$white;
            text-decoration:none;
            transition:color 300ms ease-out;
            &:hover {
              color:$gold;
            }
          }
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
  .slide-enter, .slide-leave-to{
    height: 0px;
  }
}
</style>
