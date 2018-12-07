<template>
<transition name="fade">
  <div class="vr-hud" v-if="vrModeActivated">
    <button class="vr-hud__button" @click="dive()">

    </button>
  </div>
</transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Vr-hud',
  props: {
    dive: {
      type: Function,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'vrModeActivated'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.vr-hud {
  user-select: none;
  position: fixed;
  bottom:8vh;
  right:8vh;
  &__button {
    display:block;
    border:none;
    width:75px;
    height:75px;
    background:#B5966B;
    border-radius:50%;
  }
}
</style>
