<template>
  <nav class="menu">
    <c-link class="menu__item" :href="''" :label="'Find a boutique'"></c-link>
    <button class="menu__item menu__item--sound" :class="{'disabled': sound}" type="button" name="sound" @click="toggleSound()">
      SOUND
    </button>
    <button class="menu__item" type="button">
      FR
    </button>
    <button class="menu__item menu__item--vr" type="button" @click="toggleVrMode()">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <path d="M20.636 6H3.2C2.549 6 2 6.568 2 7.27V17.71c0 .701.548 1.27 1.225 1.27h4.763c.51 0 .948-.325 1.132-.785l1.386-3.467c.233-.585.789-.996 1.438-.996.648 0 1.204.411 1.437.996l1.386 3.467c.184.46.621.784 1.106.784h4.763c.703 0 1.251-.568 1.251-1.269V7.27c0-.7-.548-1.269-1.25-1.269zM7.433 14.774c-1.218 0-2.205-1.022-2.205-2.284 0-1.262.987-2.284 2.205-2.284s2.203 1.022 2.203 2.284c0 1.262-.987 2.284-2.203 2.284zm9.022 0c-1.218 0-2.204-1.022-2.204-2.284 0-1.261.986-2.283 2.204-2.283 1.218 0 2.204 1.022 2.204 2.283 0 1.262-.986 2.283-2.204 2.283z" fill="#FFFFFF"></path>
        </g>
      </svg>
    </button>
  </nav>
</template>

<script>
import Link from '@/components/vue/Link.vue'

export default {
  name: 'Menu',
  data () {
    return {
      sound: true
    }
  },
  props: {
    vrmode: false
  },
  components: {
    'c-link': Link
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
@import '../../scss/_vars.scss';

.menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height:40px;
  position: fixed;
  z-index: $zMenu;
  top: 4vw;
  right: 4vw;
  will-change: opacity,transform;

  &__item {
    color:$white;
    margin:0 20px;
    font-size:$fs-buttons;
    letter-spacing: $ls-buttons;
    &--vr {
      opacity: .4;
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
      text-transform:uppercase;
      font-weight:$fw-bold;
      &.disabled:after {
        width:125%;
      }
      &:after {
        position:absolute;
        content:'';
        right:-5px;
        width:0%;
        height:1px;
        background-color: $white;
        top:50%;
        transition: width 300ms ease-out;
      }
    }
  }
}
</style>
