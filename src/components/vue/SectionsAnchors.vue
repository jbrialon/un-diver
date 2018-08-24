<template>
  <nav id="sections">
    <a class="section-title" :class="{active: item.id === currentSectionId}" v-for="item in items" :key="item.id" href="#" @click.stop.prevent="goToSection(item.id)">{{ item.title }}</a>
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
      'currentSectionId'
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
@import '../../scss/_vars.scss';

#sections {
  z-index: 1;
  position: fixed;
  top: 50%;
  left: 4vw;
  transform: translateY(-50%);

  @media screen and (max-width: 480px) {
    display: none;
  }

  .section-title {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    align-items: center;
    color: $white;
    font-size: 1em;
    opacity: 0.2;
    line-height: 2em;
    font-weight: normal;
    text-decoration: none;
    transition: opacity 0.5s ease-out;
    will-change: opacity;

    &.active {
      opacity: 1;
    }
  }
}
</style>
