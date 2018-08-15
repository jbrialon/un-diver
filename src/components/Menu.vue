<template>
  <nav id="menu">
    <button id="menu-vr" type="button" @click="toggleVrMode()">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <path d="M20.636 6H3.2C2.549 6 2 6.568 2 7.27V17.71c0 .701.548 1.27 1.225 1.27h4.763c.51 0 .948-.325 1.132-.785l1.386-3.467c.233-.585.789-.996 1.438-.996.648 0 1.204.411 1.437.996l1.386 3.467c.184.46.621.784 1.106.784h4.763c.703 0 1.251-.568 1.251-1.269V7.27c0-.7-.548-1.269-1.25-1.269zM7.433 14.774c-1.218 0-2.205-1.022-2.205-2.284 0-1.262.987-2.284 2.205-2.284s2.203 1.022 2.203 2.284c0 1.262-.987 2.284-2.203 2.284zm9.022 0c-1.218 0-2.204-1.022-2.204-2.284 0-1.261.986-2.283 2.204-2.283 1.218 0 2.204 1.022 2.204 2.283 0 1.262-.986 2.283-2.204 2.283z" fill="#FFFFFF"></path>
        </g>
      </svg>
    </button>
    <a id="menu-about" href="#about">
      <span class="visuallyhidden">About</span>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="408px" height="408px" viewBox="0 0 408 408">
        <path d="M51,153c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S79.05,153,51,153z M357,153c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S385.05,153,357,153z M204,153c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51S232.05,153,204,153z"></path>
      </svg>
    </a>
    <a id="menu-help" href="#help">
      <span class="visuallyhidden">Help</span>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 23.625 23.625">
        <path d="M11.812,0C5.289,0,0,5.289,0,11.812s5.289,11.813,11.812,11.813s11.813-5.29,11.813-11.813 S18.335,0,11.812,0z M14.271,18.307c-0.608,0.24-1.092,0.422-1.455,0.548c-0.362,0.126-0.783,0.189-1.262,0.189 c-0.736,0-1.309-0.18-1.717-0.539s-0.611-0.814-0.611-1.367c0-0.215,0.015-0.435,0.045-0.659c0.031-0.224,0.08-0.476,0.147-0.759 l0.761-2.688c0.067-0.258,0.125-0.503,0.171-0.731c0.046-0.23,0.068-0.441,0.068-0.633c0-0.342-0.071-0.582-0.212-0.717 c-0.143-0.135-0.412-0.201-0.813-0.201c-0.196,0-0.398,0.029-0.605,0.09c-0.205,0.063-0.383,0.12-0.529,0.176l0.201-0.828 c0.498-0.203,0.975-0.377,1.43-0.521c0.455-0.146,0.885-0.218,1.29-0.218c0.731,0,1.295,0.178,1.692,0.53 c0.395,0.353,0.594,0.812,0.594,1.376c0,0.117-0.014,0.323-0.041,0.617c-0.027,0.295-0.078,0.564-0.152,0.811l-0.757,2.68 c-0.062,0.215-0.117,0.461-0.167,0.736c-0.049,0.275-0.073,0.485-0.073,0.626c0,0.356,0.079,0.599,0.239,0.728 c0.158,0.129,0.435,0.194,0.827,0.194c0.185,0,0.392-0.033,0.626-0.097c0.232-0.064,0.4-0.121,0.506-0.17L14.271,18.307z M14.137,7.429c-0.353,0.328-0.778,0.492-1.275,0.492c-0.496,0-0.924-0.164-1.28-0.492c-0.354-0.328-0.533-0.727-0.533-1.193 c0-0.465,0.18-0.865,0.533-1.196c0.356-0.332,0.784-0.497,1.28-0.497c0.497,0,0.923,0.165,1.275,0.497 c0.353,0.331,0.53,0.731,0.53,1.196C14.667,6.703,14.49,7.101,14.137,7.429z"></path>
      </svg>
    </a>
  </nav>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    vrmode: false
  },
  methods: {
    toggleVrMode: function () {
      window.AppVrMode = !window.AppVrMode
      this.$store.commit('toggleVrMode')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/_vars.scss';

#menu {
  z-index: 1;
  position: fixed;
  top: 12vh;
  right: 2vh;
  height: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
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
  &-about, &-help {
    svg {
      height: 1.4em;
      width: 1.4em;
    }
  }
  &-about {
  }
  &-help {
  }

  path {
    fill: $white;
  }

  a {
    position: relative;
    display: inline-block;
    line-height: 0;
    color: #fff;
    text-decoration: none;
    margin-left: 1.5em;

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      width: 4.2em;
      height: 4.2em;
      background-image: radial-gradient(circle closest-side,rgba(255,255,255,.25),transparent);
      opacity: 0;
      -webkit-transition: opacity .35s ease-out;
      transition: opacity .35s ease-out;
    }
  }
}
</style>
