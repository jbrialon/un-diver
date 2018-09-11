<template>
  <div class="other-models-section">
    <div class="other-models-section__item" v-for="watch in modelsData" :key="watch.id">
      <div v-html-to-texture="getModelId(watch.id)">
        <div class="other-models-section__item--image">
          <img :src="getImageUrl(watch.id)" :alt="$t(watch.title)">
        </div>
        <div class="other-models-section__item--title" v-html="$t(watch.title)"></div>
        <div class="other-models-section__item--description" v-html="$t(watch.description)">{{ watch.description }}</div>
        <div class="other-models-section__item--price" v-html="$t(watch.price)"></div>
      </div>
      <c-link :id="getButtonId(watch.id)" :href="$t('header_cta_2_link')" :label="$t(watch.buyLink)" :big="true"></c-link>
    </div>
  </div>
</template>

<script>
import Link from '@/components/vue/Link.vue'

export default {
  name: 'OtherModelsSection',
  components: {
    'c-link': Link
  },
  props: {
    modelsData: {
      type: Array,
      required: true
    }
  },
  methods: {
    getButtonId (id) {
      return 'other-models-section-button-' + id
    },
    getModelId (id) {
      return 'other-models-section-' + id
    },
    getImageUrl (id) {
      return require('@/assets/watches/' + id + '.png')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.other-models-section {
  position: fixed;
  top: 0;
  width: 10000px;

  &__item {
    text-align: center;
    display: inline-block;
    color: $white;
    width: 210px;
    &--image {
      img {
        height: 250px;
      }
    }
    &--title {
      font-size: $fs-other-models-title;
      font-weight: $fw-medium;
      margin-top: 1em;
      margin-bottom: 1em;
    }
    &--descriptionlabel {
      font-size: $fs-other-models-description-label;
      color: $gold;
      font-weight: $fw-bold;
      text-transform: uppercase;
      line-height: 2em;
      margin-bottom: 1em;
    }
    &--description {
      font-size: $fs-other-models-description;
      font-weight: $fw-medium;
      white-space: pre-line;
      word-break: normal;
    }
    &--price {
      display: inline-block;
      position: relative;
      font-weight:$fw-bold;
      font-size: $fs-other-models-price;
      margin-top: 1em;
      margin-bottom: 1em;
      padding: 0 5px;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 10px;
        background: $gold;
        bottom: 4px;
        left: 0;
        z-index: -1;
      }
    }
  }
}

</style>
