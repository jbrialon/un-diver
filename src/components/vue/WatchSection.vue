<template>
  <div class="watch-section">
    <div v-html-to-texture="'watch-section-title'" class="watch-section__title">{{ watchData.title }}</div>

    <div class="watch-section__subtexts">
      <div class="watch-section__subtexts--container" v-html-to-texture="getSubTextId(item.id)" v-for="item in watchData.subTexts" :key="item.id">
        <div class="watch-section__subtexts--title">{{ item.title }}</div>
        <div class="watch-section__subtexts--text">{{ item.text }}</div>
      </div>
    </div>

    <div v-html-to-texture="'watch-section-details'" class="watch-section__details">
      <div class="watch-section__details--title">{{ watchData.details.title }}</div>
      <div class="watch-section__details--sku">{{ watchData.details.sku }}</div>
      <div class="watch-section__details--movementLabel">{{ watchData.details.movementLabel }}</div>
      <div class="watch-section__details--movementText">{{ watchData.details.movementText }}</div>
      <div class="watch-section__details--caseLabel">{{ watchData.details.caseLabel }}</div>
      <div class="watch-section__details--caseDiameter">{{ watchData.details.caseDiameter }}</div>
      <div class="watch-section__details--caseHeight">{{ watchData.details.caseHeight }}</div>
      <div class="watch-section__details--caseWater">{{ watchData.details.caseWater }}</div>
      <div class="watch-section__details--price">{{ watchData.details.price }}</div>
      <div>
        <c-link :href="''" :label="'buy in boutique'" class="header__link"></c-link>
      </div>
    </div>
  </div>
</template>

<script>
import Link from '@/components/vue/Link.vue'

export default {
  name: 'WatchSection',
  components: {
    'c-link': Link
  },
  props: {
    watchData: {
      type: Object,
      required: true
    }
  },
  mounted () {
  },
  methods: {
    getSubTextId (id) {
      return 'watch-subtext-' + id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

.watch-section {
  position: fixed;
  top: 0;

  &__title {
    color: $white;
    font-size: $fs-watch-title;
    font-weight:$fw-medium;
  }

  &__subtexts {
    &--container {
      display: inline-block;
    }
    &--title {
      text-transform: uppercase;
      font-size: $fs-watch-subtext-title;
      font-weight:$fw-light;
      color: $gold;
      line-height: 2em;
    }
    &--text {
      font-size: $fs-watch-subtext-text;
      font-weight: $fw-medium;
      color: $white;
      white-space: pre;
      line-height: 1.2em;
    }
  }

  &__details {
    color: $white;
    &--title {
      font-size: $fs-watch-subtext-text;
      font-weight: $fw-medium;
    }
    &--sku {
      font-weight: $fw-light;
      margin-bottom: 2em;
    }
    &--movementLabel, &--caseLabel {
      color: $gold;
      font-weight: $fw-light;
      text-transform: uppercase;
      line-height: 2em;
      margin-bottom: 1em;
    }
    &--movementText {
      white-space: pre-line;
      word-break: normal;
      width: 340px;
    }
    &--caseLabel {}
    &--caseDiameter, &--caseHeight, &--caseWater {
      line-height: 3em;
    }
    &--caseDiameter {}
    &--caseHeight {}
    &--caseWater {}
    &--price {
      display: inline-block;
      position: relative;
      font-weight:$fw-light;
      font-size: $fs-watch-price;
      margin-top: 1em;
      padding: 0 5px;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 20px;
        background: $gold;
        bottom: 4px;
        left: 0;
        z-index: -1;
      }
    }
  }
}

</style>
