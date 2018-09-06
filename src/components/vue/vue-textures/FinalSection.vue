<template>
  <div class="final-section">
    <div class="final-section__text" v-html-to-texture="'final-section-text'">{{ sectionData.text }}</div>
    <div id="final-section-ctas" class="final-section__ctas">
      <c-link :href="'#'" :label="'to surface'" class="final-section__ctas--to-surface" @click.prevent="gotoSurface"></c-link>
      <c-social-networks :footer-mode="false"></c-social-networks>
    </div>
  </div>
</template>

<script>
import Link from '@/components/vue/Link.vue'
import SocialNetworks from '@/components/vue/SocialNetworks.vue'

export default {
  name: 'FinalSection',
  components: {
    'c-link': Link,
    'c-social-networks': SocialNetworks
  },
  props: {
    sectionData: {
      type: Object,
      required: true
    }
  },
  methods: {
    gotoSurface () {
      this.$store.commit('goToSectionId', {id: 0, time: Date.now()})
    }
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

  &__ctas {
  }
}

</style>
