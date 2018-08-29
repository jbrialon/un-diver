<template>
  <div class="watch-subtexts">
    <div class="watch-subtexts__item" :ref="getItemId(item.id)" v-for="item in subtexts" :key="item.id">
      <div class="watch-subtexts__item--title">{{ item.title }}</div>
      <div class="watch-subtexts__item--text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'WatchSectionSubTexts',
  props: {
    subtexts: {
      type: Array,
      required: true
    }
  },
  mounted () {
  },
  methods: {
    getItemId (id) {
      return 'watch-subtext-' + id
    },
    getSubtextsTextures () {
      let textures = []
      for (let element in this.refs) {
        // eslint-disable-next-line
        console.log(element, '----')
        textures.push(html2canvas(element, {backgroundColor: null}))
      }
      return textures
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

.watch-subtexts {
  position: fixed;
  top: 0;
  &__item {
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
}
</style>
