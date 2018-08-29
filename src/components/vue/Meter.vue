<template>
  <div class="meter" v-if="!vrModeActivated">
    {{ meterAmount }}
    <span class="meter__unit">m</span></div>
</template>

<script>
import { mapGetters } from 'vuex'
import AnimationLoopManager from '../../utils/AnimationLoopManager'
import Utils from '../../utils/Utils'

export default {
  name: 'Meter',
  data () {
    return {
      meterAmount: 0
    }
  },
  computed: {
    ...mapGetters([
      'vrModeActivated'
    ])
  },
  mounted () {
    AnimationLoopManager.addCallback(this.updateMeter)
  },
  methods: {
    updateMeter () {
      this.meterAmount = Utils.pad(Math.round(window.AppScrollPercentage * 300), 3)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

.meter {
  position:relative;
  text-align: right;
  z-index: $zMeter;
  position: fixed;
  top: 50%;
  right: 4vw;
  height: 40px;
  transform: translateY(-50%);
  will-change: opacity,transform;
  color: $white;
  font-size: 40px;
  font-weight:$fw-light;
  padding-right:20px;
  &__unit {
    position:absolute;
    font-size:12px;
    top:4px;
    right:0;
  }
  @media screen and (max-width: 480px) {
    transform: translateY(-50%) translateX(-50%);
    top: auto;
    right: auto;
    left: 50%;
    bottom: 2vh;
  }
}
</style>
