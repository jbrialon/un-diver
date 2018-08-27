<template>
  <div id="meter">{{ meterAmount }}m</div>
</template>

<script>
import AnimationLoopManager from '../../utils/AnimationLoopManager'

export default {
  name: 'Meter',
  data () {
    return {
      meterAmount: 0
    }
  },
  mounted () {
    AnimationLoopManager.addCallback(this.updateMeter)
  },
  methods: {
    updateMeter () {
      this.meterAmount = Math.round(window.AppScrollPercentage * 300)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

#meter {
  text-align: right;
  z-index: 1;
  position: fixed;
  top: 50%;
  right: 4vw;
  height: 40px;
  display: flex;
  align-items: center;
  transform: translateY(-50%);
  will-change: opacity,transform;

  font-family: Arial, Helvetica, sans-serif;
  color: $white;
  font-size: 2em;

  @media screen and (max-width: 480px) {
    transform: translateY(-50%) translateX(-50%);
    top: auto;
    right: auto;
    left: 50%;
    bottom: 2vh;
  }
}
</style>
