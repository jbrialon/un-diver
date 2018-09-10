<template>
  <div class="watch-section" v-if="!initDiving">
    <div v-for="item in watchData.intro.items" :key="item.id" v-html-to-texture="getIntroId(item.id)" class="watch-section__intro" v-html="$t(item.text)"></div>

    <div class="watch-section__features">
      <div class="watch-section__features--container" v-html-to-texture="getFeatureId(item.id)" v-for="item in watchData.features.items" :key="item.id">
        <div v-if="item.title" class="watch-section__features--title" v-html="$t(item.title)"></div>
        <div class="watch-section__features--text" v-html="$t(item.text)"></div>
      </div>
    </div>

    <div v-html-to-texture="'watch-section-details'" class="watch-section__details">
      <div class="watch-section__details--title" v-html="$t(watchData.details.title)"></div>
      <div class="watch-section__details--sku" v-html="$t(watchData.details.sku)"></div>
      <div class="watch-section__details--movementLabel" v-html="$t(watchData.details.movementLabel)"></div>
      <div class="watch-section__details--movementText" v-html="$t(watchData.details.movementText)"></div>
      <div class="watch-section__details--caseLabel" v-html="$t(watchData.details.caseLabel)"></div>
      <div class="watch-section__details--caseDiameter" v-html="$t(watchData.details.caseDiameter)"></div>
      <div class="watch-section__details--caseHeight" v-html="$t(watchData.details.caseHeight)"></div>
      <div class="watch-section__details--caseWater" v-html="$t(watchData.details.caseWater)"></div>
      <div class="watch-section__details--price" v-html="$t(watchData.details.price)"></div>
    </div>
    <c-link id="watch-section-details-button" :href="'#'" :label="$t('stage_7_text_2')" :big="true"></c-link>
    <a id="watch-section-more-button" class="watch-section__more-button" href="#" @click.prevent="showGallery">+</a>
  </div>
</template>

<script>
import Link from '@/components/vue/Link.vue'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters([
      'initDiving'
    ])
  },
  methods: {
    getFeatureId (id) {
      return 'watch-section-feature-' + id
    },
    getIntroId (id) {
      return 'watch-section-intro-' + id
    },
    showGallery () {
      this.$store.commit('showGallery', true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.watch-section {
  position: fixed;
  top: 0;
  width: 200vw;

  &__intro {
    display: inline-block;
    color: $white;
    font-size: $fs-watch-title;
    line-height: initial;
    font-weight: 300;
    text-align: center;
  }

  &__features {
    &--container {
      display: inline-block;
    }
    &--title {
      text-transform: uppercase;
      font-size: $fs-watch-feature-title;
      font-weight:$fw-light;
      color: $gold;
      line-height: 2em;
    }
    &--text {
      font-size: $fs-watch-feature-text;
      font-weight: $fw-medium;
      color: $white;
      white-space: pre;
      line-height: 1.2em;
    }
  }

  &__details {
    display: inline-block;
    color: $white;
    &--title {
      font-size: $fs-watch-feature-text;
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

  &__more-button {
    text-decoration: none;
    font-weight: 100;
    color: $white;
    position: relative;
    font-size: 3em;
    &::before {
      content: "";
      display: block;
      position: absolute;
      z-index: -1;
      background: $gold;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      transform-origin:center;
      height: 50px;
      width: 50px;
      border-radius: 50%;
      transition: all 200ms ease-out;
    }

    &:hover {
      &::before {
        height: 60px;
        width: 60px;
        border-radius: 30px;
      }
    }
  }
}

</style>
