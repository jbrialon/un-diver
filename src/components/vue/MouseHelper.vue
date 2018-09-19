<template>
  <transition name="fade">
    <div class="mouse-helper" v-if="display">
      <icon-mouse></icon-mouse>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import iconMouse from '@/components/icon/icon-mouse.vue'
import Utils from '@/utils/Utils'

export default {
  name: 'mouse-helper',
  data () {
    return {
      percentDive: 0
    }
  },
  methods: {
    toggleVisibility () {
      this.percentDive = Math.round(window.AppScrollPercentage * 100)
    }
  },
  components: {
    iconMouse
  },
  computed: {
    ...mapGetters([
      'initDiving'
    ]),
    display () {
      return this.initDiving && this.percentDive < 3 && !Utils.isMobile()
    }
  },
  mounted () {
    AnimationLoopManager.addCallback(this.toggleVisibility)
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.mouse-helper {
  position:fixed;
  bottom:8vh;
  left:50%;
  transform: translateX(-50%);
  svg {
    display:block;
  }
}
</style>
