<template>
  <nav id="menu">
    <button id="menu-vr" type="button" @click="toggleVrMode()">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <path d="M20.636 6H3.2C2.549 6 2 6.568 2 7.27V17.71c0 .701.548 1.27 1.225 1.27h4.763c.51 0 .948-.325 1.132-.785l1.386-3.467c.233-.585.789-.996 1.438-.996.648 0 1.204.411 1.437.996l1.386 3.467c.184.46.621.784 1.106.784h4.763c.703 0 1.251-.568 1.251-1.269V7.27c0-.7-.548-1.269-1.25-1.269zM7.433 14.774c-1.218 0-2.205-1.022-2.205-2.284 0-1.262.987-2.284 2.205-2.284s2.203 1.022 2.203 2.284c0 1.262-.987 2.284-2.203 2.284zm9.022 0c-1.218 0-2.204-1.022-2.204-2.284 0-1.261.986-2.283 2.204-2.283 1.218 0 2.204 1.022 2.204 2.283 0 1.262-.986 2.283-2.204 2.283z" fill="#FFFFFF"></path>
        </g>
      </svg>
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    vrmode: false
  },
  methods: {
    toggleVrMode () {
      this.$store.commit('toggleVrMode')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

#menu {
  z-index: 1;
  position: fixed;
  top: 2vh;
  right: 2vw;
  height: 40px;
  display: flex;
  align-items: center;
  transform: translateY(-50%) translateX(-50%);
  will-change: opacity,transform;

  &-vr {
    -webkit-appearance: none;
    background: 0 0;
    border: 0;
    opacity: .4;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  path {
    fill: $white;
  }

}
</style>
