<template>
  <nav class="sections" v-if="!vrModeActivated">
    <a class="sections__title" :class="{active: item.id === currentSectionId}" v-for="item in items" :key="item.id" href="#" @click.stop.prevent="goToSection(item.id)">{{ item.title }}</a>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SectionsAnchors',
  props: {
    items: Array
  },
  computed: {
    ...mapGetters([
      'currentSectionId',
      'vrModeActivated'
    ])
  },
  methods: {
    goToSection (id) {
      this.$store.commit('goToSectionId', id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';

.sections {
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 4vw;
  transform: translateY(-50%);

  @media screen and (max-width: 480px) {
    display: none;
  }

  &__title {
    display: flex;
    color: $white;
    font-weight: $fw-medium;
    font-size: 16px;
    z-index:$zSection;
    opacity: 0.2;
    line-height: 32px;
    text-decoration: none;
    transition: opacity 0.5s ease-out;
    will-change: opacity;
    &.active {
      opacity: 1;
    }
  }
}
</style>
