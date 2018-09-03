<template>
  <div class="loader">
    <div class="circle">
      <svg class="circleFill" width="104" height="104" viewBox="0 0 104 104">
        <circle cx="52" cy="52" r="48" stroke="#B5966B" stroke-width="3" fill="none" stroke-dashoffset="50"></circle>
      </svg>
      <svg class="circleTrack" width="104" height="104" viewBox="0 0 104 104">
        <circle cx="52" cy="52" r="48" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="3" fill="none"></circle>
      </svg>
    </div>
    <div class="loader__number">
      00%
    </div>
  </div>
</template>

<script>

export default {
  name: 'loader'
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.loader {
  position:absolute;
  opacity:0;
  &__number {
    position:absolute;
    top:50%;
    left:50%;
    font-size:30px;
    color:$white;
    font-weight:$fw-medium;
    transform:translate(-50%, -50%);
  }
  .circle {
    position: relative;
    width: 104px;
    height: 104px;
    svg {
      position:absolute;
      top:0;
    }
  }
  .circleFill {
    z-index: 1;
    stroke-dasharray: 322;
    stroke-dashoffset: 322;
    transition: all 3s;
    transform: rotate(-90deg);
  }
  .circleTrack {
    z-index: 0;
  }
}
</style>
