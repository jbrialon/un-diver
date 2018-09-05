<template>
  <div class="final-section">
    <div class="final-section__text" v-html-to-texture="'final-section-text'">{{ sectionData.text }}</div>
    <div>
      <c-link :href="''" :label="'to surface'" class="header__link"></c-link>
    </div>
  </div>
</template>

<script>
import Link from '@/components/vue/Link.vue'

export default {
  name: 'FinalSection',
  components: {
    'c-link': Link
  },
  props: {
    sectionData: {
      type: Object,
      required: true
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.final-section {
  position: fixed;
  top: 0;
  width: 10000px;

  &__text {
    display: inline-block;
    color: $white;
    font-size: $fs-watch-title;
    line-height: initial;
    font-weight: 300;
    text-align: center;
    white-space: pre;
    line-height: 1.2em;
  }
}

</style>
